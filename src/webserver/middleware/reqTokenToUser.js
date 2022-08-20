/* eslint-disable no-param-reassign */
const configuration = require("../../config/configuration").getInstance();
const Token = require("../../user/token");

const secret = configuration.get("authentication", "secret");

// Token example:
// curl -i -H "Authorization:[token]" localhost:31459/api/v1/user/history

const reqTokenToUser = (req, res, next) => {
  const cookieAuthToken = req.cookies.authorization;
  const headerAuthToken = req.headers.authorization;

  if (!(cookieAuthToken || headerAuthToken)) {
    return next();
  }

  try {
    const token = Token.fromString(cookieAuthToken || headerAuthToken, secret);
    req.loggedInUser = token.user;
  } catch (error) {
    req.loggedInUser = null;
  }

  return next();
};

module.exports = reqTokenToUser;
