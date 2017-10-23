const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));


/**
 * Controller: Retrieve nowplaying movies / now airing shows
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function listSearchController(req, res) {
  const listname = req.params.listname;
  const { type, id, page } = req.query;
  console.log(listname, type, id, page)
  tmdb.listSearch(listname, type, id, page)
  .then((results) => {
    res.send(results);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = listSearchController;
