const SearchHistory = require("src/searchHistory/searchHistory");
const configuration = require("src/config/configuration").getInstance();
const TMDB = require("src/tmdb/tmdb");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for shows by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function showSearchController(req, res) {
  const { query, page } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  Promise.resolve()
    .then(() => {
      if (username) {
        return searchHistory.create(username, query);
      }
      return null;
    })
    .then(() => tmdb.showSearch(query, page))
    .then(shows => {
      res.send(shows);
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

module.exports = showSearchController;
