const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');

const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Search for movies by query, page and optional type
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function searchMediaController(req, res) {
   const { query, page, type } = req.query;

   Promise.resolve()
      .then(() => tmdb.search(query, page, type))
      .then((movies) => {
         if (movies !== undefined || movies.length > 0) {
            res.send(movies);
         } else {
            res.status(404).send({ success: false, error: 'Search query did not return any results.' });
         }
      })
      .catch((error) => {
         res.status(500).send({ success: false, error: error.message });
      });
}

module.exports = searchMediaController;
