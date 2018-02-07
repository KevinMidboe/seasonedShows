const moviedb = require('moviedb');
const convertTmdbToSeasoned = require('src/tmdb/convertTmdbToSeasoned');

const TMDB_METHODS = {
   upcoming: { movie: 'miscUpcomingMovies' },
   discover: { movie: 'discoverMovie', show: 'discoverTv' },
   popular: { movie: 'miscPopularMovies', show: 'miscPopularTvs' },
   nowplaying: { movie: 'miscNowPlayingMovies', show: 'tvOnTheAir' },
   similar: { movie: 'movieSimilar', show: 'tvSimilar' },
   search: { movie: 'searchMovie', show: 'searchTv', multi: 'searchMulti' },
   info: { movie: 'movieInfo', show: 'tvInfo' },
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
   * @returns {Promise} succeeds if movie was found
   */
   lookup(identifier, type = 'movie') {
      const query = { id: identifier };
      const cacheKey = `${this.cacheTags.info}:${type}:${identifier}`;
      return Promise.resolve()
         .then(() => this.cache.get(cacheKey))
         .catch(() => this.tmdb(this.tmdbMethod('info', type), query))
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
   * Retrive list of of items from TMDB matching the query and/or type given.
   * @param {queryText, page, type} the page number to specify in the request for discover,
   * @returns {Promise} dict with query results, current page and total_pages
   */
   search(text, page = 1, type = 'multi') {
      const query = { query: text, page };
      const cacheKey = `${this.cacheTags.search}:${page}:${type}:${text}`;
      return Promise.resolve()
         .then(() => this.cache.get(cacheKey))
         .catch(() => this.tmdb(this.tmdbMethod('search', type), query))
         .catch(() => { throw new Error('Could not search for movies/shows at tmdb.'); })
         .then(response => this.cache.set(cacheKey, response))
         .then(response => this.mapResults(response))
         .catch((error) => { throw new Error(error); })
         .then(([mappedResults, pagenumber, totalpages, total_results]) => ({
            results: mappedResults, page: pagenumber, total_results, total_pages: totalpages,
         }));
   }

   /**
   * Fetches a given list from tmdb.
   * @param {listName} List we want to fetch.
   * @param {type} The  to specify in the request for discover (default 'movie').
   * @param {id} When finding similar a id can be added to query
   * @param {page} Page number we want to fetch.
   * @returns {Promise} dict with query results, current page and total_pages
   */
   listSearch(listName, type = 'movie', id, page = '1') {
      const params = { id, page };
      const cacheKey = `${this.cacheTags[listName]}:${type}:${id}:${page}`;
      return Promise.resolve()
         .then(() => this.cache.get(cacheKey))
         .catch(() => this.tmdb(this.tmdbMethod(listName, type), params))
         .then(response => this.cache.set(cacheKey, response))
         .then(response => this.mapResults(response, type))
         .catch((error) => { throw new Error(error); })
         .then(([mappedResults, pagenumber, totalpages, total_results]) => ({
            results: mappedResults, page: pagenumber, total_pages: totalpages, total_results,
         }));
   }

   tmdbMethod(apiMethod, type) {
      const method = TMDB_METHODS[apiMethod][type];
      if (method !== undefined) return method;
      throw new Error('Could not find tmdb api method.');
   }

   /**
   * Maps our response from tmdb api to a movie/show object.
   * @param {response} JSON response from tmdb.
   * @param {type} The type declared in listSearch.
   * @returns {Promise} dict with tmdb results, mapped as movie/show objects.
   */
   mapResults(response, type) {
      return Promise.resolve()
         .then(() => {
            const mappedResults = response.results.filter((element) => {
               return (element.media_type === 'movie' || element.media_type === 'tv' || element.media_type === undefined);
            }).map((element) => convertTmdbToSeasoned(element, type));
            return [mappedResults, response.page, response.total_pages, response.total_results];
         })
         .catch((error) => { throw new Error(error); });
   }

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
