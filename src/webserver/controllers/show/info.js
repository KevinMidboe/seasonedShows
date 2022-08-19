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
    console.log("caught showinfo controller error", error);
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
  let { credits, check_existance } = req.query;

  credits && credits.toLowerCase() === "true"
    ? (credits = true)
    : (credits = false);
  check_existance && check_existance.toLowerCase() === "true"
    ? (check_existance = true)
    : (check_existance = false);

  const tmdbQueue = [tmdb.showInfo(showId)];
  if (credits) tmdbQueue.push(tmdb.showCredits(showId));

  try {
    const [Show, Credits] = await Promise.all(tmdbQueue);

    const show = Show.createJsonResponse();
    if (credits) show.credits = Credits.createJsonResponse();

    if (check_existance) show.exists_in_plex = await plex.existsInPlex(show);

    res.send(show);
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = showInfoController;
