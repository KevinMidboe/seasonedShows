import Plex from "../../../plex/plex.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();

const plex = new Plex(
  configuration.get("plex", "ip"),
  configuration.get("plex", "token")
);

/**
 * Controller: Search plex for movies, shows and episodes by query
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function searchPlexController(req, res) {
  const { query, type } = req.query;
  plex
    .search(query, type)
    .then(movies => {
      if (movies.length > 0) {
        res.send(movies);
      } else {
        res.status(404).send({
          success: false,
          message: "Search query did not give any results from plex."
        });
      }
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

export default searchPlexController;
