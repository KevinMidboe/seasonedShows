import TMDB from "../../../tmdb/tmdb.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const movieCreditsController = (req, res) => {
  const movieId = req.params.id;

  tmdb
    .movieCredits(movieId)
    .then(credits => res.send(credits.createJsonResponse()))
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting credits for movie with id: ${movieId}`
      });
    });
};

export default movieCreditsController;
