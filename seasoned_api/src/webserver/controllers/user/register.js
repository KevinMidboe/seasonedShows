const User = require('src/user/user');
const UserSecurity = require('src/user/userSecurity');

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
         res.send({ success: true, message: 'Welcome to Seasoned!' });
      })
      .catch((error) => {
         res.status(401).send({ success: false, error: error.message });
      });
}

module.exports = registerController;
