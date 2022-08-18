const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const showCreditsController = (req, res) => {
  const showId = req.params.id;

  tmdb
    .showCredits(showId)
    .then(credits => res.send(credits.createJsonResponse()))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        // TODO log unhandled errors
        console.log("caugth show credits controller error", error);
        res
          .status(500)
          .send({
            message: "An unexpected error occured while requesting show credits"
          });
      }
    });
};

module.exports = showCreditsController;
