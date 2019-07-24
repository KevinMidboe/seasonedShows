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
         const isAdmin = checkAdmin === 1 ? true : false;
         const token = new Token(user, isAdmin).toString(secret);
         res.send({
            success: true, message: 'Welcome to Seasoned!', token
         });
      })
      .catch((error) => {
         res.status(401).send({ success: false, error: error.message });
      });
}

module.exports = registerController;
