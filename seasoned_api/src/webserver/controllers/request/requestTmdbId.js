const configuration = require("src/config/configuration").getInstance();
const TMDB = require("src/tmdb/tmdb");
const RequestRepository = require("src/request/request");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const request = new RequestRepository();

const tmdbMovieInfo = id => {
  return tmdb.movieInfo(id);
};

const tmdbShowInfo = id => {
  return tmdb.showInfo(id);
};

/**
 * Controller: Request by id with type param
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestTmdbIdController(req, res) {
  const { id, type } = req.body;

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user_agent = req.headers["user-agent"];
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  let mediaFunction = undefined;

  if (id === undefined || type === undefined) {
    res.status(422).send({
      success: false,
      message: "'Missing parameteres: 'id' and/or 'type'"
    });
  }

  if (type === "movie") {
    mediaFunction = tmdbMovieInfo;
  } else if (type === "show") {
    mediaFunction = tmdbShowInfo;
  } else {
    res.status(422).send({
      success: false,
      message: 'Incorrect type. Allowed types: "movie" or "show"'
    });
  }

  mediaFunction(id)
    // .catch((error) => { console.error(error); res.status(404).send({ success: false, error: 'Id not found' }) })
    .then(tmdbMedia =>
      request.requestFromTmdb(tmdbMedia, ip, user_agent, username)
    )
    .then(() =>
      res.send({ success: true, message: "Request has been submitted." })
    )
    .catch(error => {
      res.send({ success: false, message: error.message });
    });
}

module.exports = requestTmdbIdController;
