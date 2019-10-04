const moviedb = require('km-moviedb');
const convertTmdbToMovie = require('src/tmdb/convertTmdbToMovie');
const convertTmdbToShow = require('src/tmdb/convertTmdbToShow');
const convertTmdbToPerson = require('src/tmdb/convertTmdbToPerson');
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
      showInfo: 'si', 
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
         .then(response => {
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
   * Retrieve a specific movie by id from TMDB.
   * @param {Number} identifier of the movie you want to retrieve
   * @param {String} type filter results by type (default movie).
   * @returns {Promise} succeeds if movie was found
   */
  movieInfo(identifier, credits=false, releaseDates=false) {
    const query = { id: identifier };
    const cacheKey = `${this.cacheTags.movieInfo}:${identifier}:${credits}`;

    const requests = [this.tmdb('movieInfo', query)]

    if (credits) {
      requests.push(this.tmdb('movieCredits', query))
    } else {
      // This is because we expect ordered parameters below
      requests.push(Promise.resolve([]))
    }

    if (releaseDates) {
      requests.push(this.tmdb('movieReleaseDates', query))
    }

    return Promise.resolve()
      .then(() => this.cache.get(cacheKey))
      .catch(() => Promise.all(requests))
      .catch(error => {
        if (error.status === 401) {
          throw new Error('Unathorized tmdb request, please check api key.')
        } else  if (error.status === 404) {
          throw new Error(`Could not find a movie with id: ${identifier}`)
        }

        throw new Error('Unexpected error has occured:', error.message)
      })
      .then(([movies, credits, releaseDates]) => this.cache.set(cacheKey, [movies, credits, releaseDates]))
      .then(([movies, credits, releaseDates]) => convertTmdbToMovie(movies, credits, releaseDates))
  }
 
  /**
   * Retrieve a specific show by id from TMDB.
   * @param {Number} identifier of the show you want to retrieve
   * @param {String} type filter results by type (default show).
   * @returns {Promise} succeeds if show was found
   */
  showInfo(identifier, credits=false) {
    const query = { id: identifier };
    const cacheKey = `${this.cacheTags.showInfo}:${identifier}:${credits}`;

    const requests = [this.tmdb('tvInfo', query)]

    if (credits) {
      requests.push(this.tmdb('tvCredits', query))
    }

    return Promise.resolve()
    .then(() => this.cache.get(cacheKey))
    .catch(() => Promise.all(requests))
    .catch(error => {
        if (error.status === 401) {
          throw new Error('Unathorized tmdb request, please check api key.')
        } else  if (error.status === 404) {
          throw new Error(`Could not find a show with id: ${identifier}`)
        }

        throw new Error('Unexpected error has occured:', error.message)
      })
    .then(([shows, credits]) => this.cache.set(cacheKey, [shows, credits]))
    .then(([shows, credits]) => convertTmdbToShow(shows, credits))
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

    return Promise.resolve()
      .then(() => this.cache.get(cacheKey))
      .catch(() => Promise.all([this.tmdb('personInfo', query), this.tmdb('personCombinedCredits', query)]))
      .catch(() => { throw new Error('Could not find a person with that id.'); })
      .then(([person, cast]) => this.cache.set(cacheKey, [person, cast]))
      .then(([person, cast]) => convertTmdbToPerson(person, cast))
      .catch(err => new Error('Unable to convert result to person', err))
  }



  multiSearch(search_query, page=1) {
    const query = { query: search_query, page: page };
    const cacheKey = `${this.cacheTags.multiSearch}:${page}:${search_query}`;
    return Promise.resolve()
      .then(() => this.cache.get(cacheKey))
      .catch(() => this.tmdb('searchMulti', query))
      .catch(() => { throw new Error('Could not complete search to tmdb'); })
      .then(response => this.cache.set(cacheKey, response))
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

    return Promise.resolve()
    .then(() => this.cache.get(cacheKey))
    .catch(() => this.tmdb('searchMovie', tmdbquery))
    .catch(() => { throw new Error('Could not complete movie search to tmdb'); })
    .then(response => this.cache.set(cacheKey, response))
    .then(response => this.mapAndCreateResponse(response, convertTmdbToMovie))
    .catch((error) => { console.log(error); throw new Error('Could not parse movie search result') })
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
    return Promise.resolve()
    .then(() => this.cache.get(cacheKey))
    .catch(() => this.tmdb('searchTv', tmdbquery))
    .catch(() => { throw new Error('Could not complete show search to tmdb'); })
    .then(response => this.cache.set(cacheKey, response))
    .then(response => this.mapAndCreateResponse(response, convertTmdbToShow))
    .catch((error) => { console.log(error); throw new Error('Could not parse show search result') })
  }

  /**
   * Retrive person search results from TMDB.
   * @param {String} text query you want to search for
   * @param {Number} page representing pagination of results
   * @returns {Promise} dict with query results, current page and total_pages
   */
  personSearch(query, page=1) {
    const tmdbquery = { query: query, page: page };
    const cacheKey = `${this.cacheTags.personSearch}:${page}:${query}`;
    return Promise.resolve()
    .then(() => this.cache.get(cacheKey))
    .catch(() => this.tmdb('searchPerson', tmdbquery))
    .catch(() => { throw new Error('Could not complete person search to tmdb'); })
    .then(response => this.cache.set(cacheKey, response))
    .then(response => this.mapAndCreateResponse(response, convertTmdbToPerson))
    .catch((error) => { console.log(error); throw new Error('Could not parse person search result') })
  }

  mapAndCreateResponse(response, resultConvertFunction) {
    // console.log(response)
    return {
      results: response.results.map(resultConvertFunction),
      page: response.page,
      total_results: response.total_results,
      total_pages: response.total_pages
    }
  }


  movieList(listname, page = 1) {
    const query = { page: page };
    const cacheKey = `${this.cacheTags[listname]}:${page}`;
    return Promise.resolve()
      .then(() => this.cache.get(cacheKey))
      .catch(() => this.tmdb(listname, query))
      .catch(() => { throw new Error('Unable to get movie list from tmdb')})
      .then(response => this.cache.set(cacheKey, response))
      .then(response => this.mapAndCreateResponse(response, convertTmdbToMovie));
  }

  showList(listname, page = 1) {
    const query = { page: page };
    const cacheKey = `${this.cacheTags[listname]}:${page}`;
    return Promise.resolve()
      .then(() => this.cache.get(cacheKey))
      .catch(() => this.tmdb(listname, query))
      .catch(() => { throw new Error('Unable to get show list from tmdb')})
      .then(response => this.cache.set(cacheKey, response))
      .then(response => this.mapAndCreateResponse(response, convertTmdbToShow));
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

  popular(type='movie', page=1) {
    const query = { type: type, page: page };
    const cacheKey = `${this.cacheTags.popular}:${type}:${page}`;
    return Promise.resolve()
      .then(() => this.cache.get(cacheKey))
      .catch(() => this.tmdb('miscPopularMovies', query))
      .catch((e) => { throw new Error(`Error fetching popular list of type ${type} : ${e}`) })
      .then(response => this.cache.set(cacheKey, response))
      .then(response => this.mapResults(response, type));
  }

  /**
   * Maps our response from tmdb api to a movie/show object.
   * @param {String} response from tmdb.
   * @param {String} The type declared in listSearch.
   * @returns {Promise} dict with tmdb results, mapped as movie/show objects.
   */
  mapResults(response, _) {
    let results = response.results.map((result) => {
      if (result.media_type === 'movie') {
        return convertTmdbToMovie(result);
      } else if (result.media_type === 'tv') {
        return convertTmdbToShow(result);
      } else if (result.media_type === 'person') {
        return convertTmdbToPerson(result);
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

module.exports = TMDB;
