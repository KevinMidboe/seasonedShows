const configuration = require("src/config/configuration").getInstance();
const TMDB = require("src/tmdb/tmdb");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const personCreditsController = (req, res) => {
  const personId = req.params.id;

  return tmdb
    .personCredits(personId)
    .then(credits => res.send(credits))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        // TODO log unhandled errors
        console.log("caugth show credits controller error", error);
        res.status(500).send({
          message: "An unexpected error occured while requesting person credits"
        });
      }
    });
};

module.exports = personCreditsController;
