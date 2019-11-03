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
      getAdminStateByUser: 'select admin from user where user_name = ?',
      link: 'update user set plex_userid = ? where user_name = ?'
    };
}

/**
* Create a user in a database.
* @param {User} user the user you want to create
* @returns {Promise}
*/
create(user) {
  return this.database.get(this.queries.read, user.username)
    .then(() => this.database.run(this.queries.create, user.username))
    .catch((error) => {
      if (error.name === 'AssertionError' || error.message.endsWith('user_name')) {
         throw new Error('That username is already registered');
      }
      throw Error(error)
    });
}

/**
* Retrieve a password from a database.
* @param {User} user the user you want to retrieve the password
* @returns {Promise}
*/
retrieveHash(user) {
  console.log('retrieving hash for user', user)
  return this.database.get(this.queries.retrieveHash, user.username)
    .then(row => {
      assert(row, 'The user does not exist.');
      return row.password;
    })
    .catch(err => { console.log(error); throw new Error('Unable to find your user.'); })
}

/**
* Change a user's password in a database.
* @param {User} user the user you want to create
* @param {String} password the new password you want to change
* @returns {Promise}
*/
changePassword(user, password) {
  return this.database.run(this.queries.change, [password, user.username])
}

/**
* Link plex userid with seasoned user
* @param {User} user the user you want to lunk plex userid with
* @param {Number} plexUserID plex unique id
* @returns {Promsie}
*/
linkPlexUserId(username, plexUserID) {
  return new Promise((resolve, reject) => {
    this.database.run(this.queries.link, [plexUserID, username])
      .then(row => resolve(row))
      .catch(error => {
        // TODO log this unknown db error
        console.log('db error', error)

        reject({
          status: 500,
          message: 'An unexpected error occured while linking plex and seasoned accounts',
          source: 'seasoned database'
        })
      })
  })
}

checkAdmin(user) {
  return this.database.get(this.queries.getAdminStateByUser, user.username).then((row) => {
      return row.admin;
    });
  }
}

module.exports = UserRepository;
