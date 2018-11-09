const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const RequestRepository = require('src/request/request');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const request = new RequestRepository();

const requestAsTmdb = (type, id) => {
  if (type !== undefined) {
    type = type.toLowerCase();

    if (type === 'movie') {
      return tmdb.movieInfo(id);
    } else if (type === 'show') {
      return tmdb.showInfo(id);
    } else {
      throw new Error("Unprocessable Entity: Invalid type for body parameter 'type'. Allowed values: movie|show");
    }
  }
  throw new Error("tmdbType body parameter not defined. Allowed values: movie|show")

}
/**
 * Controller: Request by id with type param
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestTmdbIdController(req, res) {
  const { id, type } = req.body;

  Promise.resolve()
  .then(() => requestAsTmdb(type, id))
  .then((requesAsTmdb) => request.addTmdb(requesAsTmdb))
  .then(() => res.send({sucess: true, message: 'Request has been submitted.'}))
  .catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = requestTmdbIdController;
