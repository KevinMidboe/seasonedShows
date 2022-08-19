const SearchHistory = require("../../../searchHistory/searchHistory");
const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for shows by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function showSearchController(req, res) {
  const { query, page, adult } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;
  const includeAdult = adult === "true";

  if (username) {
    searchHistory.create(username, query);
  }

  return tmdb
    .showSearch(query, page, includeAdult)
    .then(shows => {
      res.send(shows);
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

module.exports = showSearchController;
