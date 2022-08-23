import TMDB from "../../../tmdb/tmdb.js";
import RequestRepository from "../../../request/request.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const request = new RequestRepository();
// const { sendSMS } = require("src/notifications/sms");

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
  const userAgent = req.headers["user-agent"];
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  let mediaFunction;

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
    .then(tmdbMedia => {
      request.requestFromTmdb(tmdbMedia, ip, userAgent, username);

      // TODO enable SMS
      // const url = `https://request.movie?${tmdbMedia.type}=${tmdbMedia.id}`;
      // const message = `${tmdbMedia.title} (${tmdbMedia.year}) requested!\n${url}`;
      // sendSMS(message);
    })
    .then(() =>
      res.send({ success: true, message: "Request has been submitted." })
    )
    .catch(error => {
      res.send({ success: false, message: error.message });
    });
}

export default requestTmdbIdController;
