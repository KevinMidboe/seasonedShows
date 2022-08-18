const User = require('src/user/user');
const UserSecurity = require('src/user/userSecurity');

function createUser(username, password) {
  const userSecurity = new UserSecurity();
  const user = new User(username)

  return Promise.resolve(userSecurity.createNewUser(user, password))
}

module.exports = createUser;