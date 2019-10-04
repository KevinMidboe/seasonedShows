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
  const queryCredits = req.query.credits;
  const queryReleaseDates = req.query.release_dates;
  let credits = undefined
  let releaseDates = undefined

  if (queryCredits && queryCredits.toLowerCase() === 'true')
    credits = true
  if (queryReleaseDates && queryReleaseDates.toLowerCase() === 'true')
    releaseDates = true

  const movie = await tmdb.movieInfo(movieId, credits, releaseDates);

  plex.existsInPlex(movie)
  .catch((error) => { console.log('Error when searching plex'); })
  .then(() => {
    res.send(movie);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = movieInfoController;
