const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const personCreditsController = (req, res) => {
  const personId = req.params.id;

  return tmdb
    .personCredits(personId)
    .then(credits => res.send(credits))
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting info for person with id ${personId}.`
      });
    });
};

module.exports = personCreditsController;
