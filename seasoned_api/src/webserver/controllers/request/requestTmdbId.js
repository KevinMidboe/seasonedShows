const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const RequestRepository = require('src/request/request');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const request = new RequestRepository();

const tmdbMovieInfo = (id) => {
  return tmdb.movieInfo(id)
}

const tmdbShowInfo = (id) => {
  return tmdb.showInfo(id)
}

/**
 * Controller: Request by id with type param
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestTmdbIdController(req, res) {
  const { id, type } = req.body
  console.log('body', req.body)
  console.log('id & type', id, type)

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const user_agent = req.headers['user-agent'];
  const user = req.loggedInUser;
  let mediaFunction = undefined

  if (type === 'movie') {
    console.log('movie')
    mediaFunction = tmdbMovieInfo
  } else if (type === 'show') {
    console.log('show')
    mediaFunction = tmdbShowInfo
  } else {
    res.status(422).send({ success: false, error: 'Incorrect type. Allowed types: "movie" or "show"'})
  }

  mediaFunction(id)
    .catch((error) => { console.error(error); res.status(404).send({ success: false, error: 'Id not found' }) })
    .then((tmdbMedia) => request.requestFromTmdb(tmdbMedia, ip, user_agent, user))
    .then(() => res.send({success: true, message: 'Request has been submitted.'}))
    .catch((error) => {
      res.status(501).send({ success: false, error: error.message });
    })
}

module.exports = requestTmdbIdController;
