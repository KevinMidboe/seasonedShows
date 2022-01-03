const configuration = require("src/config/configuration").getInstance();
const RequestRepository = require("src/request/request");
const TMDB = require("src/tmdb/tmdb");
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
  const user_agent = req.headers["user-agent"];
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  let mediaFunction = undefined;

  if (type === "movie") {
    console.log("movie");
    mediaFunction = tmdbMovieInfo;
  } else if (type === "show") {
    console.log("show");
    mediaFunction = tmdbShowInfo;
  } else {
    res
      .status(422)
      .send({
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
      request.requestFromTmdb(tmdbMedia, ip, user_agent, username)
    )
    .then(() =>
      res.send({ success: true, message: "Media item successfully requested" })
    )
    .catch(err =>
      res.status(500).send({ success: false, message: err.message })
    );
}

module.exports = submitRequestController;
