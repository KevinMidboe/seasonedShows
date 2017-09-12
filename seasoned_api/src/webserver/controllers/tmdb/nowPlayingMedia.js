const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Retrieve nowplaying movies / now airing shows
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function nowPlayingMediaController(req, res) {
  const { page, type } = req.query;
  tmdb.nowplaying(page, type)
  .then((results) => {
    res.send(results);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = nowPlayingMediaController;
