const User = require("src/user/user");
const jwt = require("jsonwebtoken");

class Token {
  constructor(user, admin = false, settings = null) {
    this.user = user;
    this.admin = admin;
    this.settings = settings;
  }

  /**
   * Generate a new token.
   * @param {String} secret a cipher of the token
   * @returns {String}
   */
  toString(secret) {
    const { user, admin, settings } = this;

    let data = { username: user.username, settings };
    if (admin) data["admin"] = admin;

    return jwt.sign(data, secret, { expiresIn: "90d" });
  }

  /**
   * Decode a token.
   * @param {Token} jwtToken an encrypted token
   * @param {String} secret a cipher of the token
   * @returns {Token}
   */
  static fromString(jwtToken, secret) {
    const token = jwt.verify(jwtToken, secret, { clockTolerance: 10000 });
    if (token.username == null) throw new Error("Malformed token");

    const { username, admin, settings } = token;
    const user = new User(username);
    return new Token(user, admin, settings);
  }
}

module.exports = Token;
