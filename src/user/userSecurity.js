import bcrypt from "bcrypt";
import UserRepository from "./userRepository.js";

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
    if (user.username.trim() === "") {
      throw new Error("The username is empty.");
    } else if (clearPassword.trim() === "") {
      throw new Error("The password is empty.");
    } else {
      return this.userRepository
        .create(user)
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
    return this.userRepository
      .retrieveHash(user)
      .then(hash => UserSecurity.compareHashes(hash, clearPassword))
      .catch(() => {
        throw new Error("Incorrect username or password.");
      });
  }

  /**
   * Compare between a password and a hash password from database.
   * @param {String} hash the hash password from database
   * @param {String} clearPassword the user's password
   * @returns {Promise}
   */
  static compareHashes(hash, clearPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(clearPassword, hash, (error, match) => {
        if (match) resolve(true);
        reject(error);
      });
    });
  }

  /**
   * Hashes a password.
   * @param {String} clearPassword the user's password
   * @returns {Promise}
   */
  static hashPassword(clearPassword) {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.hash(clearPassword, saltRounds, (error, hash) => {
        if (error) reject(error);

        resolve(hash);
      });
    });
  }
}

export default UserSecurity;
