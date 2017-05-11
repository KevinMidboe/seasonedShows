const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function readMediaController(req, res) {
  const mediaId = req.params.mediaId;
  const { type } = req.query;
  tmdb.lookup(mediaId, type)
  .then((movies) => {
    res.send(movies);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = readMediaController;
