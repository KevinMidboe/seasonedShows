const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const movieReleaseDatesController = (req, res) => {
  const movieId = req.params.id;

  tmdb
    .movieReleaseDates(movieId)
    .then(releaseDates => res.send(releaseDates.createJsonResponse()))
    .catch(error => {
      const { status, message } = error;

      if (status && message) {
        res.status(status).send({ success: false, message });
      } else {
        res.status(500).send({
          message: "An unexpected error occured while requesting movie credits"
        });
      }
    });
};

module.exports = movieReleaseDatesController;
