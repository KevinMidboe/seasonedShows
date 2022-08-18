const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const SearchHistory = require("../../../searchHistory/searchHistory");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for person by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function personSearchController(req, res) {
  const { query, page, adult } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;
  const includeAdult = adult == "true" ? true : false;

  if (username) {
    searchHistory.create(username, query);
  }

  return tmdb
    .personSearch(query, page, includeAdult)
    .then(persons => res.send(persons))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        // TODO log unhandled errors
        console.log("caugth person search controller error", error);
        res.status(500).send({
          message: `An unexpected error occured while searching people with query: ${query}`
        });
      }
    });
}

module.exports = personSearchController;
