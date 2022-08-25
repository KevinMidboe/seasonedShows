import moviedb from "km-moviedb";
import redisCache from "../cache/redis.js";

import { Movie, Show, Person, Credits, ReleaseDates } from "./types.js";

class TMDBNotFoundError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
}

class TMDBUnauthorizedError extends Error {
  constructor(message = "TMDB returned access denied, requires api token.") {
    super(message);

    this.statusCode = 401;
  }
}

class TMDBUnexpectedError extends Error {
  constructor(type, errorMessage) {
    const message = `An unexpected error occured while fetching ${type} from tmdb`;
    super(message);

    this.errorMessage = errorMessage;
    this.statusCode = 500;
  }
}

class TMDBNotReachableError extends Error {
  constructor(
    message = "TMDB api not reachable, check your internet connection"
  ) {
    super(message);
  }
}

const tmdbErrorResponse = (error, type = null) => {
  if (error?.status === 404) {
    const message = error?.response?.body?.status_message;

    throw new TMDBNotFoundError(`${message.slice(0, -1)} in tmdb.`);
  } else if (error?.status === 401) {
    throw new TMDBUnauthorizedError(error?.response?.body?.status_message);
  } else if (error?.code === "ENOTFOUND") {
    throw new TMDBNotReachableError();
  }

  throw new TMDBUnexpectedError(type, error.message);
};

/**
 * Maps our response from tmdb api to a movie/show object.
 * @param {String} response from tmdb.
 * @param {String} The type declared in listSearch.
 * @returns {Promise} dict with tmdb results, mapped as movie/show objects.
 */
function mapResults(response, type = null) {
  const results = response?.results?.map(result => {
    if (type === "movie" || result.media_type === "movie") {
      const movie = Movie.convertFromTmdbResponse(result);
      return movie.createJsonResponse();
    }
    if (type === "show" || result.media_type === "tv") {
      const show = Show.convertFromTmdbResponse(result);
      return show.createJsonResponse();
    }
    if (type === "person" || result.media_type === "person") {
      const person = Person.convertFromTmdbResponse(result);
      return person.createJsonResponse();
    }

    return {};
  });

  return {
    results,
    page: response?.page,
    total_results: response?.total_results,
    total_pages: response?.total_pages
  };
}

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

  async getFromCacheOrFetchFromTmdb(cacheKey, tmdbMethod, query) {
    try {
      const result = await this.cache.get(cacheKey);
      if (!result) throw new Error();

      return result;
    } catch {
      return this.tmdb(tmdbMethod, query)
        .then(result => this.cache.set(cacheKey, result, this.defaultTTL))
        .catch(error => tmdbErrorResponse(error, tmdbMethod));
    }
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

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "movieInfo", query).then(
      movie => Movie.convertFromTmdbResponse(movie)
    );
  }

  /**
   * Retrieve credits for a movie
   * @param {Number} identifier of the movie to get credits for
   * @returns {Promise} movie cast object
   */
  movieCredits(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.movieCredits}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "movieCredits",
      query
    ).then(credits => Credits.convertFromTmdbResponse(credits));
  }

  /**
   * Retrieve release dates for a movie
   * @param {Number} identifier of the movie to get release dates for
   * @returns {Promise} movie release dates object
   */
  movieReleaseDates(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.movieReleaseDates}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "movieReleaseDates",
      query
    ).then(releaseDates => ReleaseDates.convertFromTmdbResponse(releaseDates));
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

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "tvInfo", query).then(
      show => Show.convertFromTmdbResponse(show)
    );
  }

  showCredits(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.showCredits}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "tvCredits", query).then(
      credits => Credits.convertFromTmdbResponse(credits)
    );
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

    return this.getFromCacheOrFetchFromTmdb(cacheKey, "personInfo", query).then(
      person => Person.convertFromTmdbResponse(person)
    );
  }

  personCredits(identifier) {
    const query = { id: identifier };
    const cacheKey = `tmdb/${this.cacheTags.personCredits}:${identifier}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "personCombinedCredits",
      query
    ).then(credits => Credits.convertFromTmdbResponse(credits));
  }

  multiSearch(searchQuery, page = 1, includeAdult = true) {
    const query = { query: searchQuery, page, include_adult: includeAdult };
    const cacheKey = `tmdb/${this.cacheTags.multiSearch}:${page}:${searchQuery}:${includeAdult}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "searchMulti",
      query
    ).then(response => mapResults(response));
  }

  /**
   * Retrive movie search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  movieSearch(searchQuery, page = 1, includeAdult = true) {
    const tmdbquery = {
      query: searchQuery,
      page,
      include_adult: includeAdult
    };
    const cacheKey = `tmdb/${this.cacheTags.movieSearch}:${page}:${searchQuery}:${includeAdult}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "searchMovie",
      tmdbquery
    ).then(response => mapResults(response, "movie"));
  }

  /**
   * Retrive show search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  showSearch(searchQuery, page = 1, includeAdult = true) {
    const tmdbquery = {
      query: searchQuery,
      page,
      include_adult: includeAdult
    };
    const cacheKey = `tmdb/${this.cacheTags.showSearch}:${page}:${searchQuery}:${includeAdult}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "searchTv",
      tmdbquery
    ).then(response => mapResults(response, "show"));
  }

  /**
   * Retrive person search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  personSearch(searchQuery, page = 1, includeAdult = true) {
    const tmdbquery = {
      query: searchQuery,
      page,
      include_adult: includeAdult
    };
    const cacheKey = `tmdb/${this.cacheTags.personSearch}:${page}:${searchQuery}:${includeAdult}`;

    return this.getFromCacheOrFetchFromTmdb(
      cacheKey,
      "searchPerson",
      tmdbquery
    ).then(response => mapResults(response, "person"));
  }

  movieList(listName, page = 1) {
    const query = { page };
    const cacheKey = `tmdb/${this.cacheTags[listName]}:${page}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, listName, query).then(
      response => mapResults(response, "movie")
    );
  }

  showList(listName, page = 1) {
    const query = { page };
    const cacheKey = `tmdb/${this.cacheTags[listName]}:${page}`;

    return this.getFromCacheOrFetchFromTmdb(cacheKey, listName, query).then(
      response => mapResults(response, "show")
    );
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

export default TMDB;
