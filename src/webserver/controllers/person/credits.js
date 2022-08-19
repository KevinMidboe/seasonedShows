const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");

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
        res.status(500).send({
          message: "An unexpected error occured while requesting person credits"
        });
      }
    });
};

module.exports = personCreditsController;
