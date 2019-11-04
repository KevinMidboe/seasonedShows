const moviedb = require('km-moviedb');

const { Movie, Show, Person, Credits, ReleaseDates } = require('src/tmdb/types');
// const { tmdbInfo } = require('src/tmdb/types')

class TMDB {
  constructor(cache, apiKey, tmdbLibrary) {
    this.cache = cache;
    this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);
    this.cacheTags = {
      multiSearch: 'mus', 
      movieSearch: 'mos', 
      showSearch: 'ss',
      personSearch: 'ps',
      movieInfo: 'mi',
      movieCredits: 'mc',
      movieReleaseDates: 'mrd',
      showInfo: 'si',
      showCredits: 'sc',
      personInfo: 'pi',
      miscNowPlayingMovies: 'npm',
      miscPopularMovies: 'pm',
      miscTopRatedMovies: 'tpm',
      miscUpcomingMovies: 'um',
      tvOnTheAir: 'toa',
      miscPopularTvs: 'pt',
      miscTopRatedTvs: 'trt',
    };
  }

  /**
   * Retrieve a specific movie by id from TMDB.
   * @param {Number} identifier of the movie you want to retrieve
   * @param {Boolean} add credits (cast & crew) for movie
   * @param {Boolean} add release dates for every country
   * @returns {Promise} succeeds if movie was found
   */
  movieInfo(identifier) {
    const query = { id: identifier };
    const cacheKey = `${this.cacheTags.movieInfo}:${identifier}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('movieInfo', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'movie info'))
      .then(movie => this.cache.set(cacheKey, movie, 1))
      .then(movie => Movie.convertFromTmdbResponse(movie))
  }

  /**
   * Retrieve credits for a movie
   * @param {Number} identifier of the movie to get credits for
   * @returns {Promise} movie cast object
   */
  movieCredits(identifier) {
    const query = { id: identifier }
    const cacheKey = `${this.cacheTags.movieCredits}:${identifier}`

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('movieCredits', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'movie credits'))
      .then(credits => this.cache.set(cacheKey, credits, 1))
      .then(credits => Credits.convertFromTmdbResponse(credits))
  }

  /**
   * Retrieve release dates for a movie
   * @param {Number} identifier of the movie to get release dates for
   * @returns {Promise} movie release dates object
   */
  movieReleaseDates(identifier) {
    const query = { id: identifier }
    const cacheKey = `${this.cacheTags.movieReleaseDates}:${identifier}`

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('movieReleaseDates', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'movie release dates'))
      .then(releaseDates => this.cache.set(cacheKey, releaseDates, 1))
      .then(releaseDates => ReleaseDates.convertFromTmdbResponse(releaseDates))
  }
 
  /**
   * Retrieve a specific show by id from TMDB.
   * @param {Number} identifier of the show you want to retrieve
   * @param {String} type filter results by type (default show).
   * @returns {Promise} succeeds if show was found
   */
  showInfo(identifier) {
    const query = { id: identifier };
    const cacheKey = `${this.cacheTags.showInfo}:${identifier}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('tvInfo', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'tv info'))
      .then(show => this.cache.set(cacheKey, show, 1))
      .then(show => Show.convertFromTmdbResponse(show))
  }

  showCredits(identifier) {
    const query = { id: identifier }
    const cacheKey = `${this.cacheTags.showCredits}:${identifier}`

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('tvCredits', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'show credits'))
      .then(credits => this.cache.set(cacheKey, credits, 1))
      .then(credits => Credits.convertFromTmdbResponse(credits))
  }

  /**
   * Retrieve a specific person id from TMDB.
   * @param {Number} identifier of the person you want to retrieve
   * @param {String} type filter results by type (default person).
   * @returns {Promise} succeeds if person was found
   */
  personInfo(identifier) {
    const query = { id: identifier };
    const cacheKey = `${this.cacheTags.personInfo}:${identifier}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('personInfo', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'person info'))
      .then(person => this.cache.set(cacheKey, person, 1))
      .then(person => Person.convertFromTmdbResponse(person))
  }

  multiSearch(search_query, page=1) {
    const query = { query: search_query, page: page };
    const cacheKey = `${this.cacheTags.multiSearch}:${page}:${search_query}`;
    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('searchMulti', query))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'search results'))
      .then(response => this.cache.set(cacheKey, response, 1))
      .then(response => this.mapResults(response));
  }

  /**
   * Retrive movie search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  movieSearch(query, page=1) {
    const tmdbquery = { query: query, page: page };
    const cacheKey = `${this.cacheTags.movieSearch}:${page}:${query}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('searchMovie', tmdbquery))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'movie search results'))
      .then(response => this.cache.set(cacheKey, response, 1))
      .then(response => this.mapResults(response, 'movie'))
  }

  /**
   * Retrive show search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  showSearch(query, page=1) {
    const tmdbquery = { query: query, page: page };
    const cacheKey = `${this.cacheTags.showSearch}:${page}:${query}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('searchTv', tmdbquery))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'tv search results'))
      .then(response => this.cache.set(cacheKey, response, 1))
      .then(response => this.mapResults(response, 'show'))
  }

  /**
   * Retrive person search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  personSearch(query, page=1) {

    const tmdbquery = { query: query, page: page, include_adult: true };
    const cacheKey = `${this.cacheTags.personSearch}:${page}:${query}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb('searchPerson', tmdbquery))
      .catch(tmdbError => tmdbErrorResponse(tmdbError, 'person search results'))
      .then(response => this.cache.set(cacheKey, response, 1))
      .then(response => this.mapResults(response, 'person'))
  }

  movieList(listname, page = 1) {
    const query = { page: page };
    const cacheKey = `${this.cacheTags[listname]}:${page}`;
    return this.cache.get(cacheKey)
      .catch(() => this.tmdb(listname, query))
      .catch(tmdbError => this.tmdbErrorResponse(tmdbError, 'movie list ' + listname))
      .then(response => this.cache.set(cacheKey, response, 1))
      .then(response => this.mapResults(response, 'movie'))
  }

  showList(listname, page = 1) {
    const query = { page: page };
    const cacheKey = `${this.cacheTags[listname]}:${page}`;

    return this.cache.get(cacheKey)
      .catch(() => this.tmdb(listname, query))
      .catch(tmdbError => this.tmdbErrorResponse(tmdbError, 'show list ' + listname))
      .then(response => this.cache.set(cacheKey, response, 1))
      .then(response => this.mapResults(response, 'show'))
  }

  /**
   * Maps our response from tmdb api to a movie/show object.
   * @param {String} response from tmdb.
   * @param {String} The type declared in listSearch.
   * @returns {Promise} dict with tmdb results, mapped as movie/show objects.
   */
  mapResults(response, type=undefined) {
    // console.log(response.results)
    // response.results.map(te => console.table(te))

    let results = response.results.map(result => {
      if (type === 'movie' || result.media_type === 'movie') {
        const movie = Movie.convertFromTmdbResponse(result)
        return movie.createJsonResponse()
      } else if (type === 'show' || result.media_type === 'tv') {
        const show = Show.convertFromTmdbResponse(result)
        return show.createJsonResponse()
      } else if (type === 'person' || result.media_type === 'person') {
        const person = Person.convertFromTmdbResponse(result)
        return person.createJsonResponse()
      }
    })

    return {
      results: results,
      page: response.page,
      total_results: response.total_results,
      total_pages: response.total_pages
    }
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
            resolve(reponse);
         };

         if (!argument) {
            this.tmdbLibrary[method](callback);
         } else {
            this.tmdbLibrary[method](argument, callback);
         }
      });
   }

}

function tmdbErrorResponse(error, typeString=undefined) {
  if (error.status === 404) {
    let message = error.response.body.status_message;

    throw {
      status: 404,
      message: message.slice(0, -1) + " in tmdb."
    }
  } else if (error.status === 401) {
    throw {
      status: 401,
      message: error.response.body.status_message
    }
  }

  throw {
    status: 500,
    message: `An unexpected error occured while fetching ${typeString} from tmdb`
  }
}

module.exports = TMDB;
