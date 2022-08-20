const rp = require("request-promise");
const convertPlexToSeasoned = require("./convertPlexToSeasoned");
const convertPlexToStream = require("./convertPlexToStream");

// eslint-disable-next-line
function addAttributeIfTmdbInPlex(_tmdb, plexResult) {
  const tmdb = { ..._tmdb };

  if (plexResult?.results?.length > 0) {
    plexResult.results.map(plexItem => {
      tmdb.matchedInPlex =
        tmdb.title === plexItem.title && tmdb.year === plexItem.year;
      return tmdb;
    });
  } else {
    tmdb.matchedInPlex = false;
  }

  return Promise.resolve(tmdb);
}

function mapResults(response) {
  return Promise.resolve()
    .then(() => {
      if (!response?.MediaContainer?.Metadata) return [[], 0];

      const mappedResults = response.MediaContainer.Metadata.filter(element => {
        return element.type === "movie" || element.type === "show";
      }).map(element => convertPlexToSeasoned(element));
      return [mappedResults, mappedResults.length];
    })
    .catch(error => {
      throw new Error(error);
    });
}

class PlexRepository {
  constructor(plexIP) {
    this.plexIP = plexIP;
  }

  inPlex(_tmdbResult) {
    const tmdbResult = { ..._tmdbResult };
    this.search(tmdbResult.title)
      .then(plexResult => addAttributeIfTmdbInPlex(tmdbResult, plexResult))
      .catch(() => {
        /**
         * If something crashes with search from this function it probably
         * fine to set the `matchedInPlex` attribute to false and return
         * original tmdb object
         * */

        tmdbResult.matchedInPlex = false;
        return tmdbResult;
      });
  }

  search(query) {
    const queryUri = encodeURIComponent(query);
    const uri = encodeURI(
      `http://${this.plexIP}:32400/search?query=${queryUri}`
    );
    const options = {
      uri,
      headers: {
        Accept: "application/json"
      },
      json: true
    };

    return rp(options)
      .then(result => mapResults(result))
      .then(([mappedResults, resultCount]) => ({
        results: mappedResults,
        total_results: resultCount
      }));
  }

  nowPlaying() {
    const options = {
      uri: `http://${this.plexIP}:32400/status/sessions`,
      headers: {
        Accept: "application/json"
      },
      json: true
    };

    return rp(options)
      .then(result => {
        if (result.MediaContainer.size > 0) {
          const playing =
            result.MediaContainer.Metadata.map(convertPlexToStream);
          return { size: Object.keys(playing).length, video: playing };
        }
        return { size: 0, video: [] };
      })
      .catch(err => {
        throw new Error(`Error handling plex playing. Error: ${err}`);
      });
  }

  // multipleInPlex(tmdbResults) {
  //    const results = tmdbResults.results.map(async (tmdb) => {
  //       return this.inPlex(tmdb)
  //    })
  //    return Promise.all(results)
  // }
}

module.exports = PlexRepository;
