const assert = require("assert");
const establishedDatabase = require("../database/database");

class UserRepository {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      read: "select * from user where lower(user_name) = lower(?)",
      create: "insert into user (user_name) values (?)",
      change: "update user set password = ? where user_name = ?",
      retrieveHash: "select * from user where user_name = ?",
      getAdminStateByUser: "select admin from user where user_name = ?",
      link: "update settings set plex_userid = ? where user_name = ?",
      unlink: "update settings set plex_userid = null where user_name = ?",
      createSettings: "insert into settings (user_name) values (?)",
      updateSettings:
        "update settings set user_name = ?, dark_mode = ?, emoji = ?",
      getSettings: "select * from settings where user_name = ?"
    };
  }

  /**
   * Create a user in a database.
   * @param {User} user the user you want to create
   * @returns {Promise}
   */
  create(user) {
    return this.database
      .get(this.queries.read, user.username)
      .then(() => this.database.run(this.queries.create, user.username))
      .catch(error => {
        if (
          error.name === "AssertionError" ||
          error.message.endsWith("user_name")
        ) {
          throw new Error("That username is already registered");
        }
        throw Error(error);
      });
  }

  /**
   * Retrieve a password from a database.
   * @param {User} user the user you want to retrieve the password
   * @returns {Promise}
   */
  retrieveHash(user) {
    return this.database
      .get(this.queries.retrieveHash, user.username)
      .then(row => {
        assert(row, "The user does not exist.");
        return row.password;
      })
      .catch(() => {
        throw new Error("Unable to find your user.");
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

  /**
   * Link plex userid with seasoned user
   * @param {String} username the user you want to lunk plex userid with
   * @param {Number} plexUserID plex unique id
   * @returns {Promsie}
   */
  linkPlexUserId(username, plexUserID) {
    return new Promise((resolve, reject) => {
      this.database
        .run(this.queries.link, [plexUserID, username])
        .then(row => resolve(row))
        .catch(error =>
          reject({
            status: 500,
            message:
              "An unexpected error occured while linking plex and seasoned accounts",
            source: "seasoned database"
          })
        );
    });
  }

  /**
   * Unlink plex userid with seasoned user
   * @param {User} user the user you want to lunk plex userid with
   * @returns {Promsie}
   */
  unlinkPlexUserId(username) {
    return new Promise((resolve, reject) => {
      this.database
        .run(this.queries.unlink, username)
        .then(row => resolve(row))
        .catch(error =>
          reject({
            status: 500,
            message:
              "An unexpected error occured while unlinking plex and seasoned accounts",
            source: "seasoned database"
          })
        );
    });
  }

  /**
   * Check if the user has boolean flag set for admin in database
   * @param {User} user object
   * @returns {Promsie}
   */
  checkAdmin(user) {
    return this.database
      .get(this.queries.getAdminStateByUser, user.username)
      .then(row => row.admin);
  }

  /**
   * Get settings for user matching string username
   * @param {String} username
   * @returns {Promsie}
   */
  getSettings(username) {
    return new Promise((resolve, reject) => {
      this.database
        .get(this.queries.getSettings, username)
        .then(async row => {
          if (row == null) {
            console.debug(
              `settings do not exist for user: ${username}. Creating settings entry.`
            );

            const userExistsWithUsername = await this.database.get(
              "select * from user where user_name is ?",
              username
            );
            if (userExistsWithUsername !== undefined) {
              try {
                resolve(this.dbCreateSettings(username));
              } catch (error) {
                reject(error);
              }
            } else {
              reject({
                status: 404,
                message: "User not found, no settings to get"
              });
            }
          }

          resolve(row);
        })
        .catch(() =>
          reject({
            status: 500,
            message:
              "An unexpected error occured while fetching settings for your account",
            source: "seasoned database"
          })
        );
    });
  }

  /**
   * Update settings values for user matching string username
   * @param {String} username
   * @param {String} dark_mode
   * @param {String} emoji
   * @returns {Promsie}
   */
  updateSettings(username, darkMode = null, emoji = null) {
    const settings = this.getSettings(username);
    darkMode = darkMode ? darkMode : settings.darkMode;
    emoji = emoji ? emoji : settings.emoji;

    return this.dbUpdateSettings(username, darkMode, emoji).catch(error => {
      if (error.status && error.message) {
        return error;
      }

      return {
        status: 500,
        message:
          "An unexpected error occured while updating settings for your account"
      };
    });
  }

  /**
   * Helper function for creating settings in the database
   * @param {String} username
   * @returns {Promsie}
   */
  dbCreateSettings(username) {
    return this.database
      .run(this.queries.createSettings, username)
      .then(() => this.database.get(this.queries.getSettings, username))
      .catch(error =>
        rejectUnexpectedDatabaseError(
          "Unexpected error occured while creating settings",
          503,
          error
        )
      );
  }

  /**
   * Helper function for updating settings in the database
   * @param {String} username
   * @returns {Promsie}
   */
  dbUpdateSettings(username, darkMode, emoji) {
    return new Promise(resolve =>
      this.database
        .run(this.queries.updateSettings, [username, darkMode, emoji])
        .then(row => resolve(row))
    );
  }
}

const rejectUnexpectedDatabaseError = (
  message,
  status,
  error,
  reject = null
) => {
  const body = {
    status,
    message,
    source: "seasoned database"
  };

  if (reject == null) {
    return new Promise((_, reject) => reject(body));
  }
  reject(body);
};

module.exports = UserRepository;
