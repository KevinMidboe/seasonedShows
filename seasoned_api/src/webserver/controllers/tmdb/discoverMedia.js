const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Retrieve a list of movies or shows in discover section in TMDB
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function discoverMediaController(req, res) {
  const { page, type } = req.query;
  tmdb.discover(page, type)
  .then((results) => {
    res.send(results);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = discoverMediaController;
