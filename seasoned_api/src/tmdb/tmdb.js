const moviedb = require('moviedb');
const convertTmdbToSeasoned = require('src/tmdb/convertTmdbToSeasoned');

const TMDB_METHODS = {
   upcoming: { movie: 'miscUpcomingMovies' },
   discover: { movie: 'discoverMovie', show: 'discoverTv' },
   popular: { movie: 'miscPopularMovies', show: 'miscPopularTvs' },
   nowplaying: { movie: 'miscNowPlayingMovies', show: 'tvOnTheAir' },
   similar: { movie: 'movieSimilar', show: 'tvSimilar' },
   search: { movie: 'searchMovie', show: 'searchTv', multi: 'searchMulti' },
   info: { movie: 'movieInfo', show: 'tvInfo' }
};

class TMDB {
   constructor(cache, apiKey, tmdbLibrary) {
      this.cache = cache;
      this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);
      this.cacheTags = {
         search: 'se',
         info: 'i',
         upcoming: 'u',
         discover: 'd',
         popular: 'p',
         nowplaying: 'n',
         similar: 'si',
      };
   }

   /**
   * Retrieve a specific movie by id from TMDB.
   * @param {Number} identifier of the movie you want to retrieve
   * @param {String} type filter results by type (default movie).
   * @returns {Promise} succeeds if movie was found
   */
   lookup(identifier, type = 'movie') {
      const query = { id: identifier };
      const cacheKey = `${this.cacheTags.info}:${type}:${identifier}`;
      return Promise.resolve()
         .then(() => this.cache.get(cacheKey))
         .catch(() => this.tmdb(TMDB_METHODS['info'][type], query))
         .catch(() => { throw new Error('Could not find a movie with that id.'); })
         .then(response => this.cache.set(cacheKey, response))
         .then((response) => {
            try {
               return convertTmdbToSeasoned(response, type);
            } catch (parseError) {
               console.error(parseError);
               throw new Error('Could not parse movie.');
            }
         });
   }

   /**
   * Retrive search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @param {String} type filter results by type (default multi)
   * @returns {Promise} dict with query results, current page and total_pages
   */
   search(text, page = 1, type = 'multi') {
      const query = { query: text, page: page };
      const cacheKey = `${this.cacheTags.search}:${page}:${type}:${text}`;
      return Promise.resolve()
         .then(() => this.cache.get(cacheKey))
         .catch(() => this.tmdb(TMDB_METHODS['search'][type], query))
         .catch(() => { throw new Error('Could not search for movies/shows at tmdb.'); })
         .then(response => this.cache.set(cacheKey, response))
         .then(response => this.mapResults(response));
   }

   /**
   * Fetches a given list from tmdb.
   * @param {String} listName Name of list
   * @param {String} type filter results by type (default movie)
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
   listSearch(listName, type = 'movie', page = '1') {
      const query = { page: page };
      console.log(query);
      const cacheKey = `${this.cacheTags[listName]}:${type}:${page}`;
      return Promise.resolve()
         .then(() => this.cache.get(cacheKey))
         .catch(() => this.tmdb(TMDB_METHODS[listName][type], query))
         .catch(() => { throw new Error('Error fetching list from tmdb.'); })
         .then(response => this.cache.set(cacheKey, response))
         .then(response => this.mapResults(response, type));
   }

   /**
   * Maps our response from tmdb api to a movie/show object.
   * @param {String} response from tmdb.
   * @param {String} The type declared in listSearch.
   * @returns {Promise} dict with tmdb results, mapped as movie/show objects.
   */
   mapResults(response, type) {
      console.log(response.page);
      return Promise.resolve()
         .then(() => {
            const mappedResults = response.results.filter((element) => {
               return (element.media_type === 'movie' || element.media_type === 'tv' || element.media_type === undefined);
            }).map((element) => convertTmdbToSeasoned(element, type));
            return { 
               results: mappedResults,
               page: response.page,
               total_pages: response.total_pages,
               total_results: response.total_results
            }
         })
         .catch((error) => { throw new Error(error); });
   }

  /**
   * Wraps moviedb library to support Promises.
   * @param {String} method function name in the library
   * @param {Object} argument argument to function being called
   * @returns {Promise} succeeds if callback succeeds
   */
   tmdb(method, argument) {
      return new Promise((resolve, reject) => {
         const callback = (error, reponse) => {
            if (error) {
               return reject(error);
            }
            return resolve(reponse);
         };

         if (!argument) {
            this.tmdbLibrary[method](callback);
         } else {
            this.tmdbLibrary[method](argument, callback);
         }
      });
   }
}

module.exports = TMDB;
