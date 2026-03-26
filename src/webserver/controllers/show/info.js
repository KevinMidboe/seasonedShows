import TMDB from "../../../tmdb/tmdb.js";
import Plex from "../../../plex/plex.js";
import redisCache from "../../../cache/redis.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const plex = new Plex(configuration.get("plex", "host"));

/**
 * Controller: Retrieve information for a show
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function showInfoController(req, res) {
  const showId = req.params.id;

  const { credits, release_dates, check_existance } = req.query;

  const _credits = credits?.toLowerCase() === "true";
  const releaseDates = release_dates?.toLowerCase() === "true";
  const checkExistance = check_existance?.toLowerCase() === "true";

  const cacheKey = `tmdb/s:${showId}:${credits}:${releaseDates}:${check_existance}`;
  try {
    const hit = await redisCache(cacheKey);
    if (hit) return res.send(hit);
  } catch {}

  const tmdbQueue = [tmdb.showInfo(showId)];
  if (_credits) tmdbQueue.push(tmdb.showCredits(showId));
  if (releaseDates) tmdbQueue.push(tmdb.showReleaseDates(showId));

  try {
    const [Show, Credits, ReleaseDates] = await Promise.all(tmdbQueue);

    const show = Show.createJsonResponse();
    if (Credits) show.credits = Credits.createJsonResponse();
    if (ReleaseDates)
      show.releaseDates = ReleaseDates.createJsonResponse().results;

    if (checkExistance) {
      try {
        show.exists_in_plex = await plex.existsInPlex(show);
      } catch {}
    }

    redisCache.set(cacheKey, show, 1000);
    return res.send(show);
  } catch (error) {
    return res.status(error?.statusCode || 500).send({
      success: false,
      errorMessage: error?.errorMessage,
      message:
        error?.message ||
        `An unexpected error occured while requesting info for with id: ${showId}`
    });
  }
}

export default showInfoController;
