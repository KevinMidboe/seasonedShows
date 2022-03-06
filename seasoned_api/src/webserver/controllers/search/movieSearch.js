const configuration = require("src/config/configuration").getInstance();
const TMDB = require("src/tmdb/tmdb");
const SearchHistory = require("src/searchHistory/searchHistory");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for movies by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function movieSearchController(req, res) {
  const { query, page, adult } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;
  const includeAdult = adult == "true" ? true : false;

  if (username) {
    searchHistory.create(username, query);
  }

  return tmdb
    .movieSearch(query, page, includeAdult)
    .then(movieSearchResults => res.send(movieSearchResults))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        // TODO log unhandled errors
        console.log("caugth movie search controller error", error);
        res.status(500).send({
          message: `An unexpected error occured while searching movies with query: ${query}`
        });
      }
    });
}

module.exports = movieSearchController;
