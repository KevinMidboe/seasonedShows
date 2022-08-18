const User = require('src/user/user');
const Token = require('src/user/token');

function createToken(username, secret) {
  const user = new User(username);
  const token = new Token(user);
  return token.toString(secret);
}

module.exports = createToken;
