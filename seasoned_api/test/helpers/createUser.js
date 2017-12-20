const User = require('src/user/user');
const UserSecurity = require('src/user/userSecurity');
const SqliteDatabase = require('src/database/sqliteDatabase');

function createUser(username, email, password) {
  const database = new SqliteDatabase(':memory:');
  const userSecurity = new UserSecurity(database);
  const user = new User(username, email);
  return userSecurity.createNewUser(user, password);
}

module.exports = createUser;