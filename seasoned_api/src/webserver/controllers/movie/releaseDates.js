const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');

const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));

const movieReleaseDatesController = (req, res) => {
  const movieId = req.params.id;

  tmdb.movieReleaseDates(movieId)
    .then(releaseDates => res.send(releaseDates))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(error.status).send({ success: false, error: error.message })
      } else {
        // TODO log unhandled errors : here our at tmdbReleaseError ?
        console.log('error', error)
        res.status(500).send({ message: 'An unexpected error occured while requesting movie credits' })
      }
    })
}

module.exports = movieReleaseDatesController;