const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const movieCreditsController = (req, res) => {
  const movieId = req.params.id;

  tmdb
    .movieCredits(movieId)
    .then(credits => res.send(credits.createJsonResponse()))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        // TODO log unhandled errors
        console.log("caugth movie credits controller error", error);
        res.status(500).send({
          message: "An unexpected error occured while requesting movie credits"
        });
      }
    });
};

module.exports = movieCreditsController;
