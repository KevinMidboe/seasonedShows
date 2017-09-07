const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Retrieve upcoming movies
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function getUpcomingController(req, res) {
  const { page } = req.query;
  tmdb.upcoming(page)
  .then((results) => {
    res.send(results);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = getUpcomingController;
