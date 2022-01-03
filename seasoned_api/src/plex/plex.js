const fetch = require("node-fetch");
const convertPlexToMovie = require("src/plex/convertPlexToMovie");
const convertPlexToShow = require("src/plex/convertPlexToShow");
const convertPlexToEpisode = require("src/plex/convertPlexToEpisode");

const { Movie, Show, Person } = require("src/tmdb/types");

const RedisCache = require("src/cache/redis");
const redisCache = new RedisCache();

const sanitize = string => string.toLowerCase().replace(/[^\w\s]/gi, "");

const matchingTitleAndYear = (plex, tmdb) => {
  let matchingTitle, matchingYear;

  if (plex["title"] != null && tmdb["title"] != null) {
    const plexTitle = sanitize(plex.title);
    const tmdbTitle = sanitize(tmdb.title);
    matchingTitle = plexTitle == tmdbTitle;
    matchingTitle = matchingTitle
      ? matchingTitle
      : plexTitle.startsWith(tmdbTitle);
  } else matchingTitle = false;

  if (plex["year"] != null && tmdb["year"] != null)
    matchingYear = plex.year == tmdb.year;
  else matchingYear = false;

  return matchingTitle && matchingYear;
};

const successfullResponse = response => {
  const { status, statusText } = response;

  if (status === 200) {
    return response.json();
  } else {
    throw { message: statusText, status: status };
  }
};

class Plex {
  constructor(ip, port = 32400, cache = null) {
    this.plexIP = ip;
    this.plexPort = port;

    this.cache = cache || redisCache;
    this.cacheTags = {
      machineInfo: "plex/mi",
      search: "plex/s"
    };
  }

  fetchMachineIdentifier() {
    const cacheKey = `${this.cacheTags.machineInfo}`;
    const url = `http://${this.plexIP}:${this.plexPort}/`;
    const options = {
      timeout: 20000,
      headers: { Accept: "application/json" }
    };

    return new Promise((resolve, reject) =>
      this.cache
        .get(cacheKey)
        .then(machineInfo => resolve(machineInfo["machineIdentifier"]))
        .catch(() => fetch(url, options))
        .then(response => response.json())
        .then(machineInfo =>
          this.cache.set(cacheKey, machineInfo["MediaContainer"], 2628000)
        )
        .then(machineInfo => resolve(machineInfo["machineIdentifier"]))
        .catch(error => {
          if (error != undefined && error.type === "request-timeout") {
            reject({
              message: "Plex did not respond",
              status: 408,
              success: false
            });
          }

          reject(error);
        })
    );
  }

  matchTmdbAndPlexMedia(plex, tmdb) {
    let match;

    if (plex == null || tmdb == null) return false;

    if (plex instanceof Array) {
      let possibleMatches = plex.map(plexItem =>
        matchingTitleAndYear(plexItem, tmdb)
      );
      match = possibleMatches.includes(true);
    } else {
      match = matchingTitleAndYear(plex, tmdb);
    }

    return match;
  }

  async existsInPlex(tmdb) {
    const plexMatch = await this.findPlexItemByTitleAndYear(
      tmdb.title,
      tmdb.year
    );
    return plexMatch ? true : false;
  }

  findPlexItemByTitleAndYear(title, year) {
    const query = { title, year };

    return this.search(query.title).then(plexSearchResults => {
      const matchesInPlex = plexSearchResults.map(plex =>
        this.matchTmdbAndPlexMedia(plex, query)
      );

      if (matchesInPlex.includes(true) === false) return false;

      const firstMatchIndex = matchesInPlex.indexOf(true);
      return plexSearchResults[firstMatchIndex][0];
    });
  }

  getDirectLinkByTitleAndYear(title, year) {
    const machineIdentifierPromise = this.fetchMachineIdentifier();
    const matchingObjectInPlexPromise = this.findPlexItemByTitleAndYear(
      title,
      year
    );

    return Promise.all([
      machineIdentifierPromise,
      matchingObjectInPlexPromise
    ]).then(([machineIdentifier, matchingObjectInPlex]) => {
      if (
        matchingObjectInPlex == false ||
        matchingObjectInPlex == null ||
        matchingObjectInPlex["key"] == null ||
        machineIdentifier == null
      )
        return false;

      const keyUriComponent = encodeURIComponent(matchingObjectInPlex.key);
      return `https://app.plex.tv/desktop#!/server/${machineIdentifier}/details?key=${keyUriComponent}`;
    });
  }

  search(query) {
    const cacheKey = `${this.cacheTags.search}:${query}`;

    const url = `http://${this.plexIP}:${
      this.plexPort
    }/hubs/search?query=${encodeURIComponent(query)}`;
    const options = {
      timeout: 20000,
      headers: { Accept: "application/json" }
    };

    return new Promise((resolve, reject) =>
      this.cache
        .get(cacheKey)
        .catch(() => fetch(url, options)) // else fetch fresh data
        .then(successfullResponse)
        .then(results => this.cache.set(cacheKey, results, 21600))
        .then(this.mapResults)
        .then(resolve)
        .catch(error => {
          if (error != undefined && error.type === "request-timeout") {
            reject({
              message: "Plex did not respond",
              status: 408,
              success: false
            });
          }

          reject(error);
        })
    );
  }

  mapResults(response) {
    if (
      response == null ||
      response.MediaContainer == null ||
      response.MediaContainer.Hub == null
    ) {
      return [];
    }

    return response.MediaContainer.Hub.filter(category => category.size > 0)
      .map(category => {
        if (category.type === "movie") {
          return category.Metadata;
        } else if (category.type === "show") {
          return category.Metadata.map(convertPlexToShow);
        } else if (category.type === "episode") {
          return category.Metadata.map(convertPlexToEpisode);
        }
      })
      .filter(result => result !== undefined);
  }
}

module.exports = Plex;
