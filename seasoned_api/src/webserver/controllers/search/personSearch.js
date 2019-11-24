const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const SearchHistory = require('src/searchHistory/searchHistory');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for person by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function personSearchController(req, res) {
  const user = req.loggedInUser;
  const { query, page } = req.query;

  if (user) {
    return searchHistory.create(user, query);
  }
  
  tmdb.personSearch(query, page)
    .then((person) => {
      res.send(person);
    })
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message })
      } else {
        // TODO log unhandled errors
        console.log('caugth person search controller error', error)
        res.status(500).send({
          message: `An unexpected error occured while searching people with query: ${query}`
        })
      }
    })
}

module.exports = personSearchController;
