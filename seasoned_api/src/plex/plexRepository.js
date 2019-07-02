const convertPlexToSeasoned = require('src/plex/convertPlexToSeasoned');
const convertPlexToStream = require('src/plex/convertPlexToStream');
const rp = require('request-promise');

class PlexRepository {
   constructor(plexIP) {
    this.plexIP = plexIP;
   }

   inPlex(tmdbResult) {
      return Promise.resolve()
         .then(() => this.search(tmdbResult.title))
         .then(plexResult => this.compareTmdbToPlex(tmdbResult, plexResult))
         .catch((error) => {
            console.log(error)
            tmdbResult.matchedInPlex = false;
            return tmdbResult;
         });
   }

   search(query) {
     const queryUri = encodeURIComponent(query)
     const uri = encodeURI(`http://${this.plexIP}:32400/search?query=${queryUri}`)
      const options = {
         uri: uri,
         headers: {
            Accept: 'application/json',
         },
         json: true,
      };

      return rp(options)
         .catch((error) => {
            throw new Error('Unable to search plex.')
         })
         .then(result => this.mapResults(result))
         .then(([mappedResults, resultCount]) => ({ results: mappedResults, total_results: resultCount }));
   }

   compareTmdbToPlex(tmdb, plexResult) {
      return Promise.resolve()
         .then(() => {
            if (plexResult.results.length === 0) {
               tmdb.matchedInPlex = false
            } 
            else {
               plexResult.results.map((plexItem) => {
                  if (tmdb.title === plexItem.title && tmdb.year === plexItem.year)
                     tmdb.matchedInPlex = true;
                  return tmdb;
               });
            }
            return tmdb;
         });
   }

   mapResults(response) {
      return Promise.resolve()
         .then(() => {
            console.log('plexResponse:', response)
            if (!response.MediaContainer.hasOwnProperty('Metadata')) return [[], 0];

            const mappedResults = response.MediaContainer.Metadata.filter((element) => {
               return (element.type === 'movie' || element.type === 'show');
            }).map((element) => convertPlexToSeasoned(element));
            return [mappedResults, mappedResults.length];
         })
         .catch((error) => { throw new Error(error); });
   }

   nowPlaying() {
      const options = {
         uri: `http://${this.plexIP}:32400/status/sessions`,
         headers: {
            Accept: 'application/json',
         },
         json: true,
      };

      return rp(options)
         .then((result) => {
            if (result.MediaContainer.size > 0) {
               const playing = result.MediaContainer.Metadata.map(convertPlexToStream);
               return { size: Object.keys(playing).length, video: playing };
            }
            return { size: 0, video: [] };
         })
         .catch((err) => {
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
