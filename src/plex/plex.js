import convertPlexToMovie from "./convertPlexToMovie.js";
import convertPlexToShow from "./convertPlexToShow.js";
import convertPlexToEpisode from "./convertPlexToEpisode.js";
import redisCache from "../cache/redis.js";
import { PlexRequestTimeoutError, PlexUnexpectedError } from "./errors.js";

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
  constructor(host, cache = null) {
    this.host = host;
    this.appName = "seasoned api";
    this.clientId = `seasoned-api-${Math.random().toString(36).substring(7)}`;

    this.cache = cache || redisCache;
    this.cacheTags = {
      machineInfo: "plex/mi",
      search: "plex/s",
      userInfo: "plex/u",
      recentlyAdded: "plex/add"
    };
  }

  async fetchPlexUserData(authToken) {
    const url = "https://plex.tv/api/v2/user";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-Plex-Product": this.appName,
        "X-Plex-Client-Identifier": this.clientId,
        "X-Plex-Token": authToken
      }
    };

    return fetch(url, options)
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Failed to fetch Plex user info");
        }

        return resp.json();
      })
      .then(data => {
        // Convert Unix timestamp to ISO date string if needed
        let joinedDate = null;
        if (data.joinedAt) {
          if (typeof data.joinedAt === "number") {
            joinedDate = new Date(data.joinedAt * 1000).toISOString();
          } else {
            joinedDate = data.joinedAt;
          }
        }

        const userData = {
          id: data.id,
          uuid: data.uuid,
          username: data.username || data.title || "Plex User",
          email: data.email,
          thumb: data.thumb,
          joined_at: joinedDate,
          two_factor_enabled: data.twoFactorEnabled || false,
          experimental_features: data.experimentalFeatures || false,
          subscription: {
            active: data.subscription?.active,
            plan: data.subscription?.plan,
            features: data.subscription?.features
          },
          profile: {
            auto_select_audio: data.profile?.autoSelectAudio,
            default_audio_language: data.profile?.defaultAudioLanguage,
            default_subtitle_language: data.profile?.defaultSubtitleLanguage
          },
          entitlements: data.entitlements || [],
          roles: data.roles || [],
          created_at: new Date().toISOString()
        };

        return userData;
      });
  }

  async fetchRecentlyAdded(authToken, libraryId) {
    const url = `${this.host}/library/sections/${libraryId}/recentlyAdded?X-Plex-Container-Start=0&X-Plex-Container-Size=20`;
    const options = {
      headers: {
        Accept: "application/json",
        "X-Plex-Token": authToken
      }
    };

    return fetch(url, options).then(resp => {
      if (resp.ok) return resp.json();

      if (resp.status === 401) {
        throw new Error("invalid plex auth session");
      } else if (resp.status === 404) {
        throw new Error("library id not found");
      }
      throw new Error("error fetching recetnyl added from pelx library");
    });
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

  static calculateGenreStats(metadata) {
    const genreMap = new Map();

    metadata.forEach(item => {
      if (item.Genre) {
        item.Genre.forEach(genre => {
          genreMap.set(genre.tag, (genreMap.get(genre.tag) || 0) + 1);
        });
      }
    });

    return Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }

  async fetchLibraryStats(authToken) {
    const urlSections = `${this.host}/library/sections`;
    const options = {
      headers: {
        Accept: "application/json",
        "X-Plex-Token": authToken
      }
    };

    let libraries = [];
    try {
      libraries = await fetch(urlSections, options)
        .then(resp => resp.json())
        .then(data => data.MediaContainer.Directory);
    } catch (error) {
      throw error;
    }

    const sections = {};
    if (libraries?.length < 0) return sections;

    try {
      await Promise.all(
        libraries.map(library => {
          const url = `${this.host}/library/sections/${library?.key}/all`;
          const options = {
            headers: {
              Accept: "application/json",
              "X-Plex-Token": authToken
            }
          };

          return fetch(url, options)
            .then(resp => resp.json())
            .then(data => {
              const { librarySectionID, librarySectionTitle, size, Metadata } =
                data?.MediaContainer || {};
              const key = librarySectionTitle?.toLowerCase();
              const obj = {
                id: librarySectionID,
                title: librarySectionTitle,
                total: size,
                leafCount: 0,
                childCount: 0,
                duration: 0,
                genres: []
              };

              const genres = Plex.calculateGenreStats(Metadata);
              if (genres && genres?.length > 0) obj.genres = genres;

              Metadata.forEach(item => {
                if (item?.leafCount) obj.leafCount += item.leafCount;
                if (item?.childCount) obj.childCount += item.childCount;
                if (item.duration && item?.leafCount) {
                  obj.duration += item.duration * item.leafCount;
                } else if (item?.duration) obj.duration += item.duration;
              });

              sections[key] = obj;
            });
        })
      );

      return sections || [];
    } catch (error) {
      console.log("ASDFASDF", error);
    }
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
