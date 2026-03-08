import Plex from "../../../plex/plex.js";
import redisCache from "../../../cache/redis.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();

const plex = new Plex(configuration.get("plex", "host"));

/**
 * Controller: Search plex for movies, shows and episodes by query
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function plexRecentlyAdded(req, res) {
  const { library } = req.params;

  const cacheKey = `plex/add:${library}:${req.plexAuthToken}`;
  const cacheTTL = 100;

  try {
    const hit = await redisCache.get(cacheKey);
    if (hit && req.plexAuthToken) {
      return res.send(hit);
    }
  } catch {}

  return plex
    .fetchRecentlyAdded(req.plexAuthToken, library)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: `no items found for library: ${library}`
        });
      }

      redisCache.set(cacheKey, data, cacheTTL);
      return res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ success: false, message: error.message });
    });
}

export default plexRecentlyAdded;
