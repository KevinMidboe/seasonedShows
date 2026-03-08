import Plex from "../../plex/plex.js";
import redisCache from "../../cache/redis.js";
import Configuration from "../../config/configuration.js";

const configuration = Configuration.getInstance();
const plex = new Plex(configuration.get("plex", "host"));

const mustHaveAccountLinkedToPlex = async (req, res, next) => {
  const plexAuthToken = {
    cookie: req.cookies?.plex_auth_token || null,
    header: req.headers.plex_auth || null
  };

  if (!(plexAuthToken.cookie || plexAuthToken.header)) {
    return res.status(403).send({
      success: false,
      message:
        "No plex account user id found for your user. Please authenticate your plex account at /user/authenticate."
    });
  }

  req.plexAuthToken = plexAuthToken.cookie || plexAuthToken.header;

  const cacheKey = `plex/u:${req.plexAuthToken}`;
  const cacheTTL = 10;

  try {
    const hit = await redisCache.get(cacheKey);
    if (hit) {
      req.plexUserId = JSON.parse(hit)?.id;
      return next();
    }
  } catch {}

  try {
    const userData = await plex.fetchPlexUserData(req.plexAuthToken);

    redisCache.set(cacheKey, JSON.stringify(userData), cacheTTL);
    req.plexUserId = userData.id;
    return next();
  } catch (error) {
    console.log("[PlexController]", error);
    return res.status(403).send({
      success: false,
      message: "invalid plex auth session!",
      error: error?.message
    });
  }
};

export default mustHaveAccountLinkedToPlex;
