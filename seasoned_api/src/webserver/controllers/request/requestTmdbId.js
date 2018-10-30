const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const RequestRepository = require('src/request/request');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const request = new RequestRepository();

const typeFunction = (type) => {
  type = type.toLowerCase();
  if (type === 'movie') {
    return tmdb.movieInfo;
  } else if (type === 'show') {
    return tmdb.showInfo;
  } else {
    throw new Error("Unprocessable Entity: Invalid type for query 'type'. Allowed values: movie|show");
  }
}
/**
 * Controller: Request by id with type param
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestTmdbIdController(req, res) {
  const requestId = req.params.id;
  const { type } = req.query;

  Promise.resolve()
  .then(() => typeFunction(type))
  //  .then(() => checkType
  .then(() => tmdb.movieInfo(requestId))
  .then((movie) => request.addTmdb(movie))
  .then(() => res.send({sucess: true, message: 'Request has been submitted.'}))
  .catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = requestTmdbIdController;
