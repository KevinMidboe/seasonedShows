import establishedDatabase from "../database/database.js";

class SearchHistoryCreateDatabaseError extends Error {
  constructor(message = "an unexpected error occured", errorResponse = null) {
    super(message);

    this.source = "database";
    this.statusCode = 500;
    this.errorResponse = errorResponse;
  }
}

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
    return this.database
      .all(this.queries.read, user)
      .then(result => result.map(row => row.search_query))
      .catch(error => {
        throw new Error("Unable to get history.", error);
      });
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
          throw new SearchHistoryCreateDatabaseError(
            "Could not create search history."
          );
        }

        throw new SearchHistoryCreateDatabaseError();
      });
  }
}

export default SearchHistory;
