const establishedDatabase = require('src/database/database');

class SearchHistory {

  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      'create': 'insert into search_history (search_query, user_name) values (?, ?)',
      'read': 'select search_query from search_history where user_name = ? order by id desc',
    };
  }

  /**
   * Retrive a search queries for a user from the database.
   * @param {User} user existing user
   * @returns {Promise}
   */
  read(user) {
    return this.database.all(this.queries.read, user)
      .then(rows => rows.map(row => row.search_query));
  }

  /**
   * Creates a new search entry in the database.
   * @param {User} user a new user
   * @param {String} searchQuery the query the user searched for
   * @returns {Promise}
   */
  create(user, searchQuery) {
    return this.database.run(this.queries.create, [searchQuery, user]).catch((error) => {
      if (error.message.includes('FOREIGN')) {
        throw new Error('Could not create search history.');
      }
    });
  }

}

module.exports = SearchHistory;
