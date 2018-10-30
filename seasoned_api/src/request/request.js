const assert = require('assert')
const establishedDatabase = require('src/database/database');

class RequestRepository {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      add: 'insert into request (id,title,year,type) values(?,?,?,?)',
      read: 'select * from request where id is ? and type is ?'
    };
  }

  /**
   * Add tmdb movie|show to requests
   * @param {tmdb} tmdb class of movie|show to add
   * @returns {Promise}
   */
  addTmdb(tmdb) {
    return Promise.resolve()
    .then(() => this.database.get(this.queries.read, [tmdb.id, tmdb.type]))
    .then(row => assert.equal(row, undefined, 'Id has already been requested'))
    .then(() => this.database.run(this.queries.add, [tmdb.id, tmdb.title||tmdb.name, tmdb.year, tmdb.type]))
    .catch((error) => {
      if (error.name === 'AssertionError' || error.message.endsWith('been requested')) {
        throw new Error('This id is already requested', error.message);
      }
      console.log('Error @ request.addTmdb:', error);
      throw new Error('Could not add request');
    });
  }
}

module.exports = RequestRepository;
