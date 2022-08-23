import TMDB from "../../../tmdb/tmdb.js";
import Plex from "../../../plex/plex.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const plex = new Plex(configuration.get("plex", "ip"));

/**
 * Controller: Retrieve information for a show
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

async function showInfoController(req, res) {
  const showId = req.params.id;
  let credits = req.query?.credits;
  let checkExistance = req.query?.check_existance;

  credits = credits?.toLowerCase() === "true";
  checkExistance = checkExistance?.toLowerCase() === "true";

  const tmdbQueue = [tmdb.showInfo(showId)];
  if (credits) tmdbQueue.push(tmdb.showCredits(showId));

  try {
    const [Show, Credits] = await Promise.all(tmdbQueue);

    const show = Show.createJsonResponse();
    if (credits) show.credits = Credits.createJsonResponse();

    if (checkExistance) {
      /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
      try {
        show.exists_in_plex = await plex.existsInPlex(show);
      } catch {}
    }

    return res.send(show);
  } catch (error) {
    return res.status(error?.statusCode || 500).send({
      success: false,
      message:
        error?.message ||
        `An unexpected error occured while requesting info for show with id: ${showId}`
    });
  }
}

export default showInfoController;
