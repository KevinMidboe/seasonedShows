const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const Plex = require("../../../plex/plex");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const plex = new Plex(configuration.get("plex", "ip"));

function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    res.status(status).send({ success: false, message });
  } else {
    console.log("caught movieinfo controller error", error);
    res.status(500).send({
      message: "An unexpected error occured while requesting movie info"
    });
  }
}

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function movieInfoController(req, res) {
  const movieId = req.params.id;
  let { credits, release_dates, check_existance } = req.query;

  credits && credits.toLowerCase() === "true"
    ? (credits = true)
    : (credits = false);
  release_dates && release_dates.toLowerCase() === "true"
    ? (release_dates = true)
    : (release_dates = false);
  check_existance && check_existance.toLowerCase() === "true"
    ? (check_existance = true)
    : (check_existance = false);

  let tmdbQueue = [tmdb.movieInfo(movieId)];
  if (credits) tmdbQueue.push(tmdb.movieCredits(movieId));
  if (release_dates) tmdbQueue.push(tmdb.movieReleaseDates(movieId));

  try {
    const [Movie, Credits, ReleaseDates] = await Promise.all(tmdbQueue);

    const movie = Movie.createJsonResponse();
    if (Credits) movie.credits = Credits.createJsonResponse();
    if (ReleaseDates)
      movie.release_dates = ReleaseDates.createJsonResponse().results;

    if (check_existance) {
      try {
        movie.exists_in_plex = await plex.existsInPlex(movie);
      } catch (error) {
        if (error.status === 401) {
          console.log("Unathorized request, check plex server LAN settings");
        } else {
          console.log("Unkown error from plex!");
        }
        console.log(error?.message);
      }
    }

    res.send(movie);
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = movieInfoController;
