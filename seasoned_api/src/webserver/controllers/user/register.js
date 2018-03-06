const User = require('src/user/user');
const Token = require('src/user/token');
const UserSecurity = require('src/user/userSecurity');
const configuration = require('src/config/configuration').getInstance();

const secret = configuration.get('authentication', 'secret');
const userSecurity = new UserSecurity();

/**
 * Controller: Register a new user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function registerController(req, res) {
   const user = new User(req.body.username, req.body.email);
   const password = req.body.password;

   userSecurity.createNewUser(user, password)
      .then(() => {
         const token = new Token(user).toString(secret);
         res.send({ success: true, message: 'Welcome to Seasoned!', token});
      })
      .catch((error) => {
         res.status(401).send({ success: false, error: error.message });
      });
}

module.exports = registerController;
