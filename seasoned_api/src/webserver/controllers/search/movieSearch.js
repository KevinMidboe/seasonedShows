const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const SearchHistory = require('src/searchHistory/searchHistory');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for movies by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function movieSearchController(req, res) {
  const user = req.loggedInUser;
  const { query, page } = req.query;

  if (user) {
    return searchHistory.create(user, query);
  }

  tmdb.movieSearch(query, page)
    .then(movieSearchResults => res.send(movieSearchResults))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message })
      } else {
        // TODO log unhandled errors
        console.log('caugth movie search controller error', error)
        res.status(500).send({
          message: `An unexpected error occured while searching movies with query: ${query}`
        })
      }
    })
}

module.exports = movieSearchController;
