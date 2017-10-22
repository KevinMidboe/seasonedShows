const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function popularMediaController(req, res) {
  const { page, type } = req.query;
  tmdb.popular(page, type)
  .then((results) => {
    res.send(results);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = popularMediaController;
