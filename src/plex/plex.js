const fetch = require("node-fetch");
const convertPlexToMovie = require("./convertPlexToMovie");
const convertPlexToShow = require("./convertPlexToShow");
const convertPlexToEpisode = require("./convertPlexToEpisode");

const { Movie, Show, Person } = require("../tmdb/types");

const redisCache = require("../cache/redis");

const sanitize = string => string.toLowerCase().replace(/[^\w]/gi, "");

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

const matchingTitleAndYear = (plex, tmdb) => {
  let matchingTitle;
  let matchingYear;

  if (plex.title != null && tmdb.title != null) {
    const plexTitle = sanitize(plex.title);
    const tmdbTitle = sanitize(tmdb.title);
    matchingTitle = plexTitle == tmdbTitle;
    matchingTitle = matchingTitle || plexTitle.startsWith(tmdbTitle);
  } else matchingTitle = false;

  if (plex.year != null && tmdb.year != null)
    matchingYear = plex.year == tmdb.year;
  else matchingYear = false;

  return matchingTitle && matchingYear;
};

const successfullResponse = response => {
  if (response && response.MediaContainer) return response;

  if (
    response == null ||
    response.status == null ||
    response.statusText == null
  ) {
    throw Error("Unable to decode response");
  }

  const { status, statusText } = response;

  if (status === 200) {
    return response.json();
  }
  throw { message: statusText, status };
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
        .then(machineInfo => resolve(machineInfo.machineIdentifier))
        .catch(() => fetch(url, options))
        .then(response => response.json())
        .then(machineInfo =>
          this.cache.set(cacheKey, machineInfo.MediaContainer, 2628000)
        )
        .then(machineInfo => resolve(machineInfo.machineIdentifier))
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
      const possibleMatches = plex.map(plexItem =>
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
    return !!plexMatch;
  }

  findPlexItemByTitleAndYear(title, year) {
    const query = { title, year };

    return this.search(title).then(plexResults => {
      const matchesInPlex = plexResults.map(plex =>
        this.matchTmdbAndPlexMedia(plex, query)
      );
      const matchesIndex = matchesInPlex.findIndex(el => el === true);
      return matchesInPlex != -1 ? plexResults[matchesIndex] : null;
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
        matchingObjectInPlex.key == null ||
        machineIdentifier == null
      )
        return false;

      const keyUriComponent = fixedEncodeURIComponent(matchingObjectInPlex.key);
      return `https://app.plex.tv/desktop#!/server/${machineIdentifier}/details?key=${keyUriComponent}`;
    });
  }

  search(query) {
    const cacheKey = `${this.cacheTags.search}:${query}`;

    const url = `http://${this.plexIP}:${
      this.plexPort
    }/hubs/search?query=${fixedEncodeURIComponent(query)}`;
    const options = {
      timeout: 20000,
      headers: { Accept: "application/json" }
    };

    return new Promise((resolve, reject) =>
      this.cache
        .get(cacheKey)
        .catch(() => fetch(url, options)) // else fetch fresh data
        .then(successfullResponse)
        .then(results => this.cache.set(cacheKey, results, 21600)) // 6 hours
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

  // this is not guarenteed to work, but if we see a movie or
  // show has been imported, this function can be helpfull to call
  // in order to try bust the cache preventing movieInfo and
  // showInfo from seeing updates through existsInPlex.
  bustSearchCacheWithTitle(title) {
    const query = title;
    const cacheKey = `${this.cacheTags.search}/${query}*`;

    this.cache.del(
      cacheKey,
      (error,
      response => {
        if (response == 1) return true;

        // TODO improve cache key matching by lowercasing it on the backend.
        // what do we actually need to check for if the key was deleted or not
        // it might be an error or another response code.
        console.log("Unable to delete, key might not exists");
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
        }
        if (category.type === "show") {
          return category.Metadata.map(convertPlexToShow);
        }
        if (category.type === "episode") {
          return category.Metadata.map(convertPlexToEpisode);
        }
      })
      .filter(result => result !== undefined);
  }
}

module.exports = Plex;
