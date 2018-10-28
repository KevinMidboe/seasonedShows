const SearchHistory = require('src/searchHistory/searchHistory');
const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
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

  Promise.resolve()
  .then(() => {
    if (user) {
      return searchHistory.create(user, query);
    }
    return null
  })
  .then(() => tmdb.movieSearch(query, page))
  .then((movies) => {
    res.send(movies);
  })
  .catch((error) => {
    res.status(500).send({ success: false, error: error.message });
  });
}

module.exports = movieSearchController;
