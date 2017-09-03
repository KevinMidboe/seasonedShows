const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Search for movies by query, page and optionally adult
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function searchMoviesController(req, res) {
  const { query, page, type } = req.query;

  Promise.resolve()
  .then(() => tmdb.search(query, page, type))
  .then((movies) => {
  	if (movies !== undefined || movies.length > 0) {
  		res.send(movies);
  	} else {
  		res.status(404).send({ success: false, error: 'Search query did not return any results.'})
  	}
    res.send(movies);
  })
  .catch((error) => {
    res.status(500).send({ success: false, error: error.message });
  });
}

module.exports = searchMoviesController;
