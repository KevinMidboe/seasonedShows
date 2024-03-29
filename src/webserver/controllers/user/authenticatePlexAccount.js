import FormData from "form-data";
import UserRepository from "../../../user/userRepository.js";

const userRepository = new UserRepository();

class PlexAuthenticationError extends Error {
  constructor(errorResponse) {
    const message =
      "Unexptected error while authenticating to plex signin api. View error response.";
    super(message);

    this.errorResponse = errorResponse;
    this.statusCode = 500;
    this.success = false;
    this.source = "plex";
  }
}

class PlexUnauthorizedError extends Error {
  constructor(errorResponse) {
    const message = "Unauthorized. Please check plex credentials.";
    super(message);

    this.errorResponse = errorResponse;
    this.statusCode = 401;
    this.success = false;
    this.source = "plex";
  }
}

function handleResponse(response) {
  if (!response.ok) {
    if (response?.status === 401)
      throw new PlexUnauthorizedError(response?.statusText);

    throw new PlexAuthenticationError(response?.statusText);
  }

  return response.json();
}

function plexAuthenticate(username, password) {
  const url = "https://plex.tv/api/v2/users/signin";

  const form = new FormData();
  form.append("login", username);
  form.append("password", password);
  form.append("rememberMe", "false");

  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": form.getHeaders()["content-type"],
    "X-Plex-Client-Identifier": "seasonedRequest"
  };
  const options = {
    method: "POST",
    headers,
    body: form
  };

  return fetch(url, options).then(resp => handleResponse(resp));
}

function link(req, res) {
  const user = req.loggedInUser;
  const { username, password } = req.body;

  return plexAuthenticate(username, password)
    .then(plexUser => userRepository.linkPlexUserId(user.username, plexUser.id))
    .then(() =>
      res.send({
        success: true,
        message:
          "Successfully authenticated and linked plex account with seasoned request."
      })
    )
    .catch(error =>
      res.status(error?.statusCode || 500).send({
        message:
          error?.message ||
          "Unexptected error occured while linking plex account",
        success: error?.success || false,
        source: error?.source,
        errorResponse: error?.errorResponse
      })
    );
}

function unlink(req, res) {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  return userRepository
    .unlinkPlexUserId(username)
    .then(() =>
      res.send({
        success: true,
        message: "Successfully unlinked plex account from seasoned request."
      })
    )
    .catch(error =>
      res.status(error?.statusCode || 500).send({
        message:
          error?.message ||
          "Unexptected error occured while unlinking plex account",
        success: error?.success || false,
        source: error?.source,
        errorResponse: error?.errorResponse
      })
    );
}

export default { link, unlink };
