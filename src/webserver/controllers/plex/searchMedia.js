import PlexRepository from "../../../plex/plexRepository";
import Configuration from "../../../config/configuration";

const configuration = Configuration.getInstance();

const plexRepository = new PlexRepository(
  configuration.get("plex", "ip"),
  configuration.get("plex", "token")
);

/**
 * Controller: Search for media and check existence
 * in plex by query and page
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function searchMediaController(req, res) {
  const { query } = req.query;

  plexRepository
    .search(query)
    .then(media => {
      if (media !== undefined || media.length > 0) {
        res.send(media);
      } else {
        res.status(404).send({
          success: false,
          message: "Search query did not return any results."
        });
      }
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

export default searchMediaController;
