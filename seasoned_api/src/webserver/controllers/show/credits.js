const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');

const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));

const showCreditsController = (req, res) => {
  const showId = req.params.id;

  tmdb.showCredits(showId)
    .then(credits => res.send(credits.createJsonResponse()))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(error.status).send({ success: false, error: error.message })
      } else {
        // TODO log unhandled errors
        console.log('caugth show credits controller error', error)
        res.status(500).send({ message: 'An unexpected error occured while requesting show credits' })
      }
    })
}

module.exports = showCreditsController;