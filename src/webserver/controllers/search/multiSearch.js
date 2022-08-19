const configuration = require("../../..//config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const SearchHistory = require("../../../searchHistory/searchHistory");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

function checkAndCreateJsonResponse(result) {
  if (typeof result["createJsonResponse"] === "function") {
    return result.createJsonResponse();
  }
  return result;
}

/**
 * Controller: Search for multi (movies, shows and people by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function multiSearchController(req, res) {
  const { query, page, adult } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  if (username) {
    searchHistory.create(username, query);
  }

  return tmdb
    .multiSearch(query, page, adult)
    .then(multiSearchResults => res.send(multiSearchResults))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        // TODO log unhandled errors
        console.log("caugth multi search controller error", error);
        res.status(500).send({
          message: `An unexpected error occured while searching with query: ${query}`
        });
      }
    });
}

module.exports = multiSearchController;
