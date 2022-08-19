const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const SearchHistory = require("../../../searchHistory/searchHistory");

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
  const includeAdult = adult === "true";

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
        res.status(500).send({
          message: `An unexpected error occured while searching movies with query: ${query}`
        });
      }
    });
}

module.exports = movieSearchController;
