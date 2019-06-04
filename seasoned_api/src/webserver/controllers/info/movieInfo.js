const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const Plex = require('src/plex/plex');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const plex = new Plex(configuration.get('plex', 'ip'));

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function movieInfoController(req, res) {
  const movieId = req.params.id;
  const { credits } = req.query;
  const movie = await tmdb.movieInfo(movieId, credits);

  plex.existsInPlex(movie)
  .catch((error) => { console.log('Error when searching plex'); })
  .then(() => {
    console.log('movie', movie)
    res.send(movie);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = movieInfoController;
