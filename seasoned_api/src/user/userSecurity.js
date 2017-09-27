const bcrypt = require('bcrypt-nodejs');
const UserRepository = require('src/user/userRepository');

class UserSecurity {

  constructor(database) {
    this.userRepository = new UserRepository(database);
  }

  /**
   * Create a new user in PlanFlix.
   * @param {User} user the new user you want to create
   * @param {String} clearPassword a password of the user
   * @returns {Promise}
   */
  createNewUser(user, clearPassword) {
    if (user.username.trim() === '') {
      throw new Error('The username is empty.');
    } else if (user.email.trim() === '') {
      throw new Error('The email is empty.');
    } else if (clearPassword.trim() === '') {
      throw new Error('The password is empty.');
    } else {
      return Promise.resolve()
      .then(() => this.userRepository.create(user))
      .then(() => UserSecurity.hashPassword(clearPassword))
      .then(hash => this.userRepository.changePassword(user, hash));
    }
  }

  /**
   * Login into PlanFlix.
   * @param {User} user the user you want to login
   * @param {String} clearPassword the user's password
   * @returns {Promise}
   */
  login(user, clearPassword) {
    return Promise.resolve()
      .then(() => this.userRepository.retrieveHash(user))
      .then(hash => UserSecurity.compareHashes(hash, clearPassword))
      .catch(() => { throw new Error('Wrong username or password.'); });
  }

  /**
   * Compare between a password and a hash password from database.
   * @param {String} hash the hash password from database
   * @param {String} clearPassword the user's password
   * @returns {Promise}
   */
  static compareHashes(hash, clearPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(clearPassword, hash, (error, matches) => {
        if (matches === true) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Hashes a password.
   * @param {String} clearPassword the user's password
   * @returns {Promise}
   */
  static hashPassword(clearPassword) {
    return new Promise((resolve) => {
      bcrypt.hash(clearPassword, null, null, (error, hash) => {
        resolve(hash);
      });
    });
  }
}

module.exports = UserSecurity;
