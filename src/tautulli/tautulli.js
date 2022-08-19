const fetch = require("node-fetch");

class TautulliUnexpectedError extends Error {
  constructor(errorMessage) {
    const message = "Unexpected error fetching from tautulli.";
    super(message);

    this.statusCode = 500;
    this.errorMessage = errorMessage;
  }
}

class Tautulli {
  constructor(apiKey, ip, port) {
    this.apiKey = apiKey;
    this.ip = ip;
    this.port = port;
  }

  buildUrlWithCmdAndUserid(cmd, userId) {
    const url = new URL("api/v2", `http://${this.ip}:${this.port}`);
    url.searchParams.append("apikey", this.apiKey);
    url.searchParams.append("cmd", cmd);
    url.searchParams.append("user_id", userId);

    return url;
  }

  /* eslint-disable-next-line class-methods-use-this */
  logTautulliError(error) {
    throw new TautulliUnexpectedError(error);
  }

  getPlaysByDayOfWeek(plexUserId, days, yAxis) {
    const url = this.buildUrlWithCmdAndUserid(
      "get_plays_by_dayofweek",
      plexUserId
    );
    url.searchParams.append("time_range", days);
    url.searchParams.append("y_axis", yAxis);

    return fetch(url.href)
      .then(resp => resp.json())
      .catch(error => this.logTautulliError(error));
  }

  getPlaysByDays(plexUserId, days, yAxis) {
    const url = this.buildUrlWithCmdAndUserid("get_plays_by_date", plexUserId);
    url.searchParams.append("time_range", days);
    url.searchParams.append("y_axis", yAxis);

    return fetch(url.href)
      .then(resp => resp.json())
      .catch(error => this.logTautulliError(error));
  }

  watchTimeStats(plexUserId) {
    const url = this.buildUrlWithCmdAndUserid(
      "get_user_watch_time_stats",
      plexUserId
    );
    url.searchParams.append("grouping", 0);

    return fetch(url.href)
      .then(resp => resp.json())
      .catch(error => this.logTautulliError(error));
  }

  viewHistory(plexUserId) {
    const url = this.buildUrlWithCmdAndUserid("get_history", plexUserId);

    url.searchParams.append("start", 0);
    url.searchParams.append("length", 50);

    return fetch(url.href)
      .then(resp => resp.json())
      .catch(error => this.logTautulliError(error));
  }
}

module.exports = Tautulli;
