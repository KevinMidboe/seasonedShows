import convertPlexToMovie from "./convertPlexToMovie.js";
import convertPlexToShow from "./convertPlexToShow.js";
import convertPlexToEpisode from "./convertPlexToEpisode.js";
import redisCache from "../cache/redis.js";

class PlexRequestTimeoutError extends Error {
  constructor() {
    const message = "Timeout: Plex did not respond.";

    super(message);
    this.statusCode = 408;
  }
}

class PlexUnexpectedError extends Error {
  constructor(plexError = null) {
    const message = "Unexpected plex error occured.";

    super(message);
    this.statusCode = 500;
    this.plexError = plexError;
  }
}

const sanitize = string => string.toLowerCase().replace(/[^\w]/gi, "");
const matchingTitleAndYear = (plex, tmdb) => {
  let matchingTitle;
  let matchingYear;

  if (plex?.title && tmdb?.title) {
    const plexTitle = sanitize(plex.title);
    const tmdbTitle = sanitize(tmdb.title);
    matchingTitle = plexTitle === tmdbTitle;
    matchingTitle = matchingTitle || plexTitle.startsWith(tmdbTitle);
  } else matchingTitle = false;

  if (plex?.year && tmdb?.year) matchingYear = plex.year === tmdb.year;
  else matchingYear = false;

  return matchingTitle && matchingYear;
};

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

function matchTmdbAndPlexMedia(plex, tmdb) {
  let match;

  if (plex === null || tmdb === null) return false;

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

const successfullResponse = response => {
  const { status, statusText } = response;
  if (status !== 200) {
    throw new PlexUnexpectedError(statusText);
  }

  if (response?.MediaContainer) return response;

  return response.json();
};

function mapResults(response) {
  if (response?.MediaContainer?.Hub === null) {
    return [];
  }

  return response.MediaContainer.Hub.filter(category => category.size > 0)
    .map(category => {
      if (category.type === "movie") {
        return category.Metadata.map(convertPlexToMovie);
      }
      if (category.type === "show") {
        return category.Metadata.map(convertPlexToShow);
      }
      if (category.type === "episode") {
        return category.Metadata.map(convertPlexToEpisode);
      }

      return null;
    })
    .filter(result => result !== null);
}

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

    return new Promise((resolve, reject) => {
      this.cache
        .get(cacheKey)
        .then(machineInfo => resolve(machineInfo?.machineIdentifier))
        .catch(() => fetch(url, options))
        .then(response => response.json())
        .then(machineInfo =>
          this.cache.set(cacheKey, machineInfo.MediaContainer, 2628000)
        )
        .then(machineInfo => resolve(machineInfo?.machineIdentifier))
        .catch(error => {
          if (error?.type === "request-timeout") {
            reject(new PlexRequestTimeoutError());
          }

          reject(new PlexUnexpectedError());
        });
    });
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
        matchTmdbAndPlexMedia(plex, query)
      );
      const matchesIndex = matchesInPlex.findIndex(el => el === true);
      return matchesInPlex !== -1 ? plexResults[matchesIndex] : null;
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
        matchingObjectInPlex === false ||
        matchingObjectInPlex === null ||
        matchingObjectInPlex.key === null ||
        machineIdentifier === null
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
    }/hubs/search?query=${fixedEncodeURIComponent(query)}&X-Plex-Token=${
      this.token
    }`;

    const options = {
      timeout: 20000,
      headers: { Accept: "application/json" }
    };

    return new Promise((resolve, reject) => {
      this.cache
        .get(cacheKey)
        .catch(() => {
          // else fetch fresh data
          return fetch(url, options)
            .then(successfullResponse)
            .then(results => this.cache.set(cacheKey, results, 21600)); // 6 hours
        })
        .then(mapResults)
        .then(resolve)
        .catch(error => {
          if (error?.type === "request-timeout") {
            reject(new PlexRequestTimeoutError());
          }

          reject(new PlexUnexpectedError());
        });
    });
  }

  // this is not guarenteed to work, but if we see a movie or
  // show has been imported, this function can be helpfull to call
  // in order to try bust the cache preventing movieInfo and
  // showInfo from seeing updates through existsInPlex.
  bustSearchCacheWithTitle(title) {
    const query = title;
    const cacheKey = `${this.cacheTags.search}/${query}*`;

    this.cache.del(cacheKey, (error, response) => {
      // TODO improve cache key matching by lowercasing it on the backend.
      // what do we actually need to check for if the key was deleted or not
      // it might be an error or another response code.
      console.log("Unable to delete, key might not exists"); // eslint-disable-line no-console
      return response === 1;
    });
  }
}

export default Plex;
