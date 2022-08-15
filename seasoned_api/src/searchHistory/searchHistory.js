const establishedDatabase = require("../database/database");

class SearchHistory {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      create:
        "insert into search_history (search_query, user_name) values (?, ?)",
      read: "select search_query from search_history where user_name = ? order by id desc"
    };
  }

  /**
   * Retrive a search queries for a user from the database.
   * @param {User} user existing user
   * @returns {Promise}
   */
  read(user) {
    return new Promise((resolve, reject) =>
      this.database
        .all(this.queries.read, user)
        .then((result, error) => {
          if (error) throw new Error(error);
          resolve(result.map(row => row.search_query));
        })
        .catch(error => {
          console.log("Error when fetching history from database:", error);
          reject("Unable to get history.");
        })
    );
  }

  /**
   * Creates a new search entry in the database.
   * @param {String} username logged in user doing the search
   * @param {String} searchQuery the query the user searched for
   * @returns {Promise}
   */
  create(username, searchQuery) {
    return this.database
      .run(this.queries.create, [searchQuery, username])
      .catch(error => {
        if (error.message.includes("FOREIGN")) {
          throw new Error("Could not create search history.");
        }

        throw {
          success: false,
          status: 500,
          message: "An unexpected error occured",
          source: "database"
        };
      });
  }
}

module.exports = SearchHistory;
