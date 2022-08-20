const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");

const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

const movieReleaseDatesController = (req, res) => {
  const movieId = req.params.id;

  tmdb
    .movieReleaseDates(movieId)
    .then(releaseDates => res.send(releaseDates.createJsonResponse()))
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting release dates for movie with id: ${movieId}`
      });
    });
};

module.exports = movieReleaseDatesController;
