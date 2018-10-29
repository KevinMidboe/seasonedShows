const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const Plex = require('src/plex/plex');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const plex = new Plex(configuration.get('plex', 'ip'));

/**
 * Controller: Retrieve information for a show 
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

function showInfoController(req, res) {
  const showId = req.params.id;
  tmdb.showInfo(showId)
  .then((show) => plex.existsInPlex(show))
  .then((show) => {
    res.send(show);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = showInfoController;
