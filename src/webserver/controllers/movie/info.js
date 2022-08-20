const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const Plex = require("../../../plex/plex");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const plex = new Plex(configuration.get("plex", "ip"));

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function movieInfoController(req, res) {
  const movieId = req.params.id;

  let credits = req.query?.credits;
  let releaseDates = req.query?.release_dates;
  let checkExistance = req.query?.check_existance;

  credits = credits?.toLowerCase() === "true";
  releaseDates = releaseDates?.toLowerCase() === "true";
  checkExistance = checkExistance?.toLowerCase() === "true";

  const tmdbQueue = [tmdb.movieInfo(movieId)];
  if (credits) tmdbQueue.push(tmdb.movieCredits(movieId));
  if (releaseDates) tmdbQueue.push(tmdb.movieReleaseDates(movieId));

  try {
    const [Movie, Credits, ReleaseDates] = await Promise.all(tmdbQueue);

    const movie = Movie.createJsonResponse();
    if (Credits) movie.credits = Credits.createJsonResponse();
    if (ReleaseDates)
      movie.releaseDates = ReleaseDates.createJsonResponse().results;

    if (checkExistance) {
      try {
        movie.exists_in_plex = await plex.existsInPlex(movie);
      } catch {}
    }

    return res.send(movie);
  } catch (error) {
    return res.status(error?.statusCode || 500).send({
      success: false,
      errorMessage: error?.errorMessage,
      message:
        error?.message ||
        `An unexpected error occured while requesting info for with id: ${movieId}`
    });
  }
}

module.exports = movieInfoController;
