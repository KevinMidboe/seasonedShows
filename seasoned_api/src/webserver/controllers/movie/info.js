const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const Plex = require('src/plex/plex');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const plex = new Plex(configuration.get('plex', 'ip'));

function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    res.status(error.status).send({ success: false, error: error.message })
  } else {
    console.log('caught movieinfo controller error', error)
    res.status(500).send({ message: 'An unexpected error occured while requesting movie info'})
  }
}

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function movieInfoController(req, res) {
  const movieId = req.params.id;
  let { credits, release_dates, check_existance } = req.query;

  credits && credits.toLowerCase() === 'true' ? credits = true : credits = false
  release_dates && release_dates.toLowerCase() === 'true' ? release_dates = true : release_dates = false
  check_existance && check_existance.toLowerCase() === 'true' ? check_existance = true : check_existance = false

  let tmdbQueue = [tmdb.movieInfo(movieId)]
  if (credits)
    tmdbQueue.push(tmdb.movieCredits(movieId))
  if (release_dates)
    tmdbQueue.push(tmdb.movieReleaseDates(movieId))

  try {
    const [ Movie, Credits, ReleaseDates ] = await Promise.all(tmdbQueue)

    const movie = Movie.createJsonResponse()
    if (Credits)
      movie.credits = Credits.createJsonResponse()
    if (ReleaseDates)
      movie.release_dates = ReleaseDates.createJsonResponse().results

    if (check_existance)
      movie.exists_in_plex = await plex.existsInPlex(movie)
  
    res.send(movie)
  } catch(error) {
    handleError(error, res)
  }
}

module.exports = movieInfoController;
