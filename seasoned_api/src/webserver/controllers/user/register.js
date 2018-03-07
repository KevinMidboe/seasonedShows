const User = require('src/user/user');
const Token = require('src/user/token');
const UserSecurity = require('src/user/userSecurity');
const UserRepository = require('src/user/userRepository');
const configuration = require('src/config/configuration').getInstance();

const secret = configuration.get('authentication', 'secret');
const userSecurity = new UserSecurity();
const userRepository = new UserRepository();

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
      .then(() => userRepository.checkAdmin(user))
      .then((checkAdmin) => {
         const token = new Token(user).toString(secret);
         const admin_state = checkAdmin == 1 ? true : false;
         res.send({ success: true, message: 'Welcome to Seasoned!', token, admin: admin_state });
      })
      .catch((error) => {
         res.status(401).send({ success: false, error: error.message });
      });
}

module.exports = registerController;
