const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');

const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

const movieReleaseDatesController = (req, res) => {
  const movieId = req.params.id;

  tmdb.movieReleaseDates(movieId)
    .then(releaseDates => res.send(releaseDates.createJsonResponse()))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message })
      } else {
        // TODO log unhandled errors : here our at tmdbReleaseError ?
        console.log('caugth release dates controller error', error)
        res.status(500).send({ message: 'An unexpected error occured while requesting movie credits' })
      }
    })
}

module.exports = movieReleaseDatesController;
