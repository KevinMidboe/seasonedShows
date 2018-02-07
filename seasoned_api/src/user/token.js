const User = require('src/user/user');
const jwt = require('jsonwebtoken');

class Token {
   constructor(user) {
      this.user = user;
   }

   /**
    * Generate a new token.
    * @param {String} secret a cipher of the token
    * @returns {String}
    */
   toString(secret) {
      return jwt.sign({ username: this.user.username }, secret);
   }

   /**
   * Decode a token.
   * @param {Token} jwtToken an encrypted token
   * @param {String} secret a cipher of the token
   * @returns {Token}
   */
   static fromString(jwtToken, secret) {
      let username = null;

      try {
         username = jwt.verify(jwtToken, secret).username;
      } catch (error) {
         throw new Error('The token is invalid.');
      }
      const user = new User(username);
      return new Token(user);
   }
}

module.exports = Token;
