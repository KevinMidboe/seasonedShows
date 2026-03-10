import TMDB from "../../../tmdb/tmdb.js";
import redisCache from "../../../cache/redis.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

/**
 * Controller: Search plex for movies, shows and episodes by query
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function discoverMovieController(req, res) {
  const { id } = req.params;
  const { page } = req.query;

  if (!TMDB.discoverableExists(id)) {
    return res.status(400).send({
      message: `Invalid discover id!`,
      success: false
    });
  }

  const cacheKey = `tmdb/disc:${id}:${page}`;

  try {
    const hit = await redisCache.get(cacheKey);
    if (hit) {
      return res.send(hit);
    }
  } catch {}

  return tmdb
    .movieDiscover(id, page)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: `no items found for library:`
        });
      }

      redisCache.set(cacheKey, data, 100);
      return res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ success: false, message: error.message });
    });
}

export default discoverMovieController;
