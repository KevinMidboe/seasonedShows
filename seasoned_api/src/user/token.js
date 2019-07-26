const User = require('src/user/user');
const jwt = require('jsonwebtoken');

class Token {
  constructor(user, admin=false) {
    this.user = user;
    this.admin = admin;
  }

  /**
    * Generate a new token.
    * @param {String} secret a cipher of the token
    * @returns {String}
    */
  toString(secret) {
    const username = this.user.username;
    const admin = this.admin;
    let data = { username }

    if (admin)
      data = { ...data, admin }

    return jwt.sign(data, secret, { expiresIn: '90d' });
  }

  /**
   * Decode a token.
   * @param {Token} jwtToken an encrypted token
   * @param {String} secret a cipher of the token
   * @returns {Token}
   */
  static fromString(jwtToken, secret) {
    let username = null;

    const token = jwt.verify(jwtToken, secret, { clockTolerance: 10000 })
    if (token.username === undefined || token.username === null)
      throw new Error('Malformed token')

    username = token.username
    const user = new User(username)
    return new Token(user)
  }
}

module.exports = Token;
