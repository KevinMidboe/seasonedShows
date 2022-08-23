import TMDB from "../../../tmdb/tmdb.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const showCreditsController = (req, res) => {
  const showId = req.params.id;

  tmdb
    .showCredits(showId)
    .then(credits => res.send(credits.createJsonResponse()))
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting credits for show with id: ${showId}.`
      });
    });
};

export default showCreditsController;
