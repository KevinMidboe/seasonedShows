import TMDB from "../../../tmdb/tmdb.js";
import Plex from "../../../plex/plex.js";
import redisCache from "../../../cache/redis.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const plex = new Plex(configuration.get("plex", "host"));

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function movieInfoController(req, res) {
  const movieId = req.params.id;

  let { credits, release_dates, check_existance } = req.query;

  credits = credits?.toLowerCase() === "true";
  const releaseDates = release_dates?.toLowerCase() === "true";
  const checkExistance = check_existance?.toLowerCase() === "true";

  const cacheKey = `tmdb/m:${movieId}:${credits}:${releaseDates}:${check_existance}`;
  try {
    const hit = await redisCache(cacheKey);
    if (hit) return res.send(hit);
  } catch {}

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

    redisCache.set(cacheKey, movie, 1000);
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

export default movieInfoController;
