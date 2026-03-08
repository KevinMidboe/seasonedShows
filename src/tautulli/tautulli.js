import redisCache from "../cache/redis.js";
import { TautulliUnexpectedError } from "./errors.js";

function logTautulliError(error) {
  console.log("sadge error", error);
  throw new TautulliUnexpectedError(error);
}

class Tautulli {
  constructor(apiKey, host, cache = null) {
    this.apiKey = apiKey;
    this.host = host;
    this.cache = cache || redisCache;

    this.AVAILABLE_STATISTIC_TYPES = [
      "home_stats",
      "plays_by_date",
      "plays_by_dayofweek",
      "plays_by_hourofday",
      "home_stats"
    ];
  }

  typeExists(type) {
    return type && this.AVAILABLE_STATISTIC_TYPES.includes(type);
  }

  buildUrlWithCmdAndUserid(cmd, userId) {
    const cmdPrefix = "get_";
    const url = new URL("api/v2", this.host);
    url.searchParams.append("apikey", this.apiKey);
    url.searchParams.append("cmd", cmdPrefix + cmd);
    url.searchParams.append("user_id", userId);

    return url;
  }

  async getUserStatsOfResource(resource, plexUserId, days, yAxis = "plays") {
    const url = this.buildUrlWithCmdAndUserid(resource, plexUserId);
    url.searchParams.append("time_range", days);
    url.searchParams.append("y_axis", yAxis);
    url.searchParams.append("grouping", 0);

    const cacheKey = `tau/${resource}/${plexUserId}:${days}:${yAxis}`;
    let hit = null;

    try {
      hit = await this.cache.get(cacheKey);
      return hit;
    } catch (_) {}

    return fetch(url.href)
      .then(resp => {
        if (!resp?.ok) {
          throw new Error("Failed to fetch Tautulli resource");
        }
        return resp?.json();
      })
      .then(response => {
        if (response?.response?.result === "error") {
          throw new Error("error response from tautulli");
        }

        const { data } = response?.response;
        this.cache.set(cacheKey, data, 10);
        return data;
      });
  }

  async watchTimeStats(plexUserId) {
    const url = this.buildUrlWithCmdAndUserid(
      "get_user_watch_time_stats",
      plexUserId
    );
    url.searchParams.append("grouping", 0);

    return fetch(url.href)
      .then(resp => resp.json())
      .catch(error => logTautulliError(error));
  }

  async viewHistory(plexUserId) {
    const url = this.buildUrlWithCmdAndUserid("get_history", plexUserId);

    url.searchParams.append("start", 0);
    url.searchParams.append("length", 50);

    return fetch(url.href)
      .then(resp => resp.json())
      .catch(error => logTautulliError(error));
  }
}

export default Tautulli;
