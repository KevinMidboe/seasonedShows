const assert = require('assert');
const establishedDatabase = require('src/database/database');

class UserRepository {
   constructor(database) {
      this.database = database || establishedDatabase;
      this.queries = {
         read: 'select * from user where lower(user_name) = lower(?)',
         create: 'insert into user (user_name) values (?)',
         change: 'update user set password = ? where user_name = ?',
         retrieveHash: 'select * from user where user_name = ?',
      };
   }

   /**
   * Create a user in a database.
   * @param {User} user the user you want to create
   * @returns {Promise}
   */
   create(user) {
      return Promise.resolve()
         .then(() => this.database.get(this.queries.read, user.username))
         .then(() => this.database.run(this.queries.create, user.username))
         .catch((error) => {
            if (error.name === 'AssertionError' || error.message.endsWith('user_name')) {
               throw new Error('That username is already registered');
            }
         });
   }

   /**
   * Retrieve a password from a database.
   * @param {User} user the user you want to retrieve the password
   * @returns {Promise}
   */
   retrieveHash(user) {
      return this.database.get(this.queries.retrieveHash, user.username).then((row) => {
         assert(row, 'The user does not exist.');
         return row.password;
      });
   }

   /**
   * Change a user's password in a database.
   * @param {User} user the user you want to create
   * @param {String} password the new password you want to change
   * @returns {Promise}
   */
   changePassword(user, password) {
      return this.database.run(this.queries.change, [password, user.username]);
   }
}

module.exports = UserRepository;
