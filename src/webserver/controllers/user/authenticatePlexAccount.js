const FormData = require("form-data");
const UserRepository = require("../../../user/userRepository");

const userRepository = new UserRepository();

class PlexAuthenticationError extends Error {
  constructor(errorResponse, statusCode) {
    const message =
      "Unexptected error while authenticating to plex signin api. View error response.";
    super(message);

    this.errorResponse = errorResponse;
    this.statusCode = statusCode;
    this.success = false;
  }
}

function handleError(error, res) {
  const status = error?.status;
  let { message, source } = error;

  if (status && message) {
    if (status === 401) {
      message = "Unauthorized. Please check plex credentials.";
      source = "plex";
    }

    res.status(status).send({ success: false, message, source });
  } else {
    // eslint-disable-next-line no-console
    console.log("caught authenticate plex account controller error", error);
    res.status(500).send({
      message:
        "An unexpected error occured while authenticating your account with plex",
      source
    });
  }
}

function handleResponse(response) {
  if (!response.ok) {
    throw new PlexAuthenticationError(response.statusText, response.status);
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
    .catch(error => handleError(error, res));
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
    .catch(error => handleError(error, res));
}

module.exports = {
  link,
  unlink
};
