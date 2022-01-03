const configuration = require("src/config/configuration").getInstance();
const TMDB = require("src/tmdb/tmdb");
const SearchHistory = require("src/searchHistory/searchHistory");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for person by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function personSearchController(req, res) {
  const { query, page } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  if (username) {
    return searchHistory.create(username, query);
  }

  tmdb
    .personSearch(query, page)
    .then(person => {
      res.send(person);
    })
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
