const configuration = require("../../../config/configuration").getInstance();
const RequestRepository = require("../../../request/request");
const TMDB = require("../../../tmdb/tmdb");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const request = new RequestRepository();

const tmdbMovieInfo = id => {
  return tmdb.movieInfo(id);
};

const tmdbShowInfo = id => {
  return tmdb.showInfo(id);
};

/**
 * Controller: POST a media id to be donwloaded
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function submitRequestController(req, res) {
  // This is the id that is the param of the url
  const id = req.params.mediaId;
  const type = req.query.type ? req.query.type.toLowerCase() : undefined;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  let mediaFunction;

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

  if (mediaFunction === undefined) {
    res.status(200);
    return;
  }

  mediaFunction(id)
    .then(tmdbMedia =>
      request.requestFromTmdb(tmdbMedia, ip, userAgent, username)
    )
    .then(() =>
      res.send({ success: true, message: "Media item successfully requested" })
    )
    .catch(err =>
      res.status(500).send({ success: false, message: err.message })
    );
}

module.exports = submitRequestController;
