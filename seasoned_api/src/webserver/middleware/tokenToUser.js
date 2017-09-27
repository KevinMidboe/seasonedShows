/* eslint-disable no-param-reassign */
const configuration = require('src/config/configuration').getInstance();
const secret = configuration.get('authentication', 'secret');
const Token = require('src/user/token');

// Token example:
// curl -i -H "Authorization:[token]" localhost:31459/api/v1/user/history

const tokenToUser = (req, res, next) => {
  const rawToken = req.headers.authorization;
  if (rawToken) {
    try {
      const token = Token.fromString(rawToken, secret);
      req.loggedInUser = token.user;
    } catch (error) {
      req.loggedInUser = undefined;
    }
  }
  next();
};

module.exports = tokenToUser;
