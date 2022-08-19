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
    res.status(500).send({
      message: "An unexpected error occured while requesting show info."
    });
  }
}

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

    res.send(show);
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = showInfoController;
