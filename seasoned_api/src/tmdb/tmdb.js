const moviedb = require("km-moviedb");
const RedisCache = require("src/cache/redis");
const redisCache = new RedisCache();

const {
  Movie,
  Show,
  Person,
  Credits,
  ReleaseDates
} = require("src/tmdb/types");

const tmdbErrorResponse = (error, typeString = undefined) => {
  if (error.status === 404) {
    let message = error.response.body.status_message;

    throw {
      status: 404,
      message: message.slice(0, -1) + " in tmdb."
    };
  } else if (error.status === 401) {
    throw {
      status: 401,
      message: error.response.body.status_message
    };
  }

  throw {
    status: 500,
    message: `An unexpected error occured while fetching ${typeString} from tmdb`
  };
};

class TMDB {
  constructor(apiKey, cache, tmdbLibrary) {
    this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);

    this.cache = cache || redisCache;
    this.cacheTags = {
      multiSearch: "mus",
      movieSearch: "mos",
      showSearch: "ss",
      personSearch: "ps",
      movieInfo: "mi",
      movieCredits: "mc",
      movieReleaseDates: "mrd",
      movieImages: "mimg",
      showInfo: "si",
      showCredits: "sc",
      personInfo: "pi",
      personCredits: "pc",
      miscNowPlayingMovies: "npm",
      miscPopularMovies: "pm",
      miscTopRatedMovies: "tpm",
      miscUpcomingMovies: "um",
      tvOnTheAir: "toa",
      miscPopularTvs: "pt",
      miscTopRatedTvs: "trt"
    };
    this.defaultTTL = 86400;
  }

  getFromCacheOrFetchFromTmdb(cacheKey, tmdbMethod, query) {
    return new Promise((resolve, reject) =>
      this.cache
        .get(cacheKey)
        .then(resolve)
        .catch(() => this.tmdb(tmdbMethod, query))
        .then(resolve)
        .catch(error => reject(tmdbErrorResponse(error, tmdbMethod)))
    );
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
    const cacheKey = `tmdb/${this.cacheTags.movieInfo}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "movieInfo", query)
      .then(movie => this.cache.set(cacheKey, movie, this.defaultTTL))
      .then(movie => Movie.convertFromTmdbResponse(movie));
  }

  /**
   * Retrieve credits for a movie
   * @param {Number} identifier of the movie to get credits for
   * @returns {Promise} movie cast object
   */
  movieCredits(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.movieCredits}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "movieCredits", query)
      .then(credits => this.cache.set(cacheKey, credits, this.defaultTTL))
      .then(credits => Credits.convertFromTmdbResponse(credits));
  }

  /**
   * Retrieve release dates for a movie
   * @param {Number} identifier of the movie to get release dates for
   * @returns {Promise} movie release dates object
   */
  movieReleaseDates(identifier) {
    const query = { id: identifier }
    const cacheKey = `tmdb/${this.cacheTags.movieReleaseDates}:${identifier}`

    return this.getFromCacheOrFetchFromTmdb(cacheKey, 'movieReleaseDates', query)
      .then(releaseDates => this.cache.set(cacheKey, releaseDates, this.defaultTTL))
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
    const cacheKey = `tmdb/${this.cacheTags.showInfo}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "tvInfo", query)
      .then(show => this.cache.set(cacheKey, show, this.defaultTTL))
      .then(show => Show.convertFromTmdbResponse(show));
  }

  showCredits(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.showCredits}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "tvCredits", query)
      .then(credits => this.cache.set(cacheKey, credits, this.defaultTTL))
      .then(credits => Credits.convertFromTmdbResponse(credits));
  }

  /**
   * Retrieve a specific person id from TMDB.
   * @param {Number} identifier of the person you want to retrieve
   * @param {String} type filter results by type (default person).
   * @returns {Promise} succeeds if person was found
   */
  personInfo(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.personInfo}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "personInfo", query)
      .then(person => this.cache.set(cacheKey, person, this.defaultTTL))
      .then(person => Person.convertFromTmdbResponse(person));
  }

  personCredits(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.personCredits}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "personCombinedCredits",
      query
    )
      .then(credits => this.cache.set(cacheKey, credits, this.defaultTTL))
      .then(credits => Credits.convertFromTmdbResponse(credits));
  }

  multiSearch(search_query, page = 1, include_adult = true) {
    const query = { query: search_query, page, include_adult };
    const cacheKey = `tmdb/${this.cacheTags.multiSearch}:${page}:${search_query}:${include_adult}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "searchMulti", query)
      .then(response => this.cache.set(cacheKey, response, this.defaultTTL))
      .then(response => this.mapResults(response));
  }

  /**
   * Retrive movie search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  movieSearch(search_query, page = 1, include_adult = true) {
    const tmdbquery = { query: search_query, page, include_adult };
    const cacheKey = `tmdb/${this.cacheTags.movieSearch}:${page}:${search_query}:${include_adult}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "searchMovie", tmdbquery)
      .then(response => this.cache.set(cacheKey, response, this.defaultTTL))
      .then(response => this.mapResults(response, "movie"));
  }

  /**
   * Retrive show search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  showSearch(search_query, page = 1, include_adult = true) {
    const tmdbquery = { query: search_query, page, include_adult };
    const cacheKey = `tmdb/${this.cacheTags.showSearch}:${page}:${search_query}:${include_adult}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "searchTv", tmdbquery)
      .then(response => this.cache.set(cacheKey, response, this.defaultTTL))
      .then(response => this.mapResults(response, "show"));
  }

  /**
   * Retrive person search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  personSearch(search_query, page = 1, include_adult = true) {
    const tmdbquery = { query: search_query, page, include_adult };
    const cacheKey = `tmdb/${this.cacheTags.personSearch}:${page}:${search_query}:${include_adult}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "searchPerson", tmdbquery)
      .then(response => this.cache.set(cacheKey, response, this.defaultTTL))
      .then(response => this.mapResults(response, "person"));
  }

  movieList(listname, page = 1) {
    const query = { page: page };
    const cacheKey = `tmdb/${this.cacheTags[listname]}:${page}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, listname, query)
      .then(response => this.cache.set(cacheKey, response, this.defaultTTL))
      .then(response => this.mapResults(response, "movie"));
  }

  showList(listname, page = 1) {
    const query = { page: page };
    const cacheKey = `tmdb/${this.cacheTags[listname]}:${page}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, listName, query)
      .then(response => this.cache.set(cacheKey, response, this.defaultTTL))
      .then(response => this.mapResults(response, "show"));
  }

  /**
   * Maps our response from tmdb api to a movie/show object.
   * @param {String} response from tmdb.
   * @param {String} The type declared in listSearch.
   * @returns {Promise} dict with tmdb results, mapped as movie/show objects.
   */
  mapResults(response, type = undefined) {
    let results = response.results.map(result => {
      if (type === "movie" || result.media_type === "movie") {
        const movie = Movie.convertFromTmdbResponse(result);
        return movie.createJsonResponse();
      } else if (type === "show" || result.media_type === "tv") {
        const show = Show.convertFromTmdbResponse(result);
        return show.createJsonResponse();
      } else if (type === "person" || result.media_type === "person") {
        const person = Person.convertFromTmdbResponse(result);
        return person.createJsonResponse();
      }
    });

    return {
      results: results,
      page: response.page,
      total_results: response.total_results,
      total_pages: response.total_pages
    };
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

module.exports = TMDB;
