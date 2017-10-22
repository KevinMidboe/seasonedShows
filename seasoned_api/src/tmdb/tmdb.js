const moviedb = require('moviedb');
const convertTmdbToSeasoned = require('src/tmdb/convertTmdbToSeasoned');
var methodTypes = { 'movie': 'searchMovie', 'show': 'searchTv', 'multi': 'searchMulti', 'movieInfo': 'movieInfo', 
	'tvInfo': 'tvInfo', 'upcomingMovies': 'miscUpcomingMovies', 'discoverMovie': 'discoverMovie', 
	'discoverShow': 'discoverTv', 'popularMovies': 'miscPopularMovies', 'popularShows': 'miscPopularTvs',
	'nowPlayingMovies': 'miscNowPlayingMovies', 'nowAiringShows': 'tvOnTheAir', 'movieSimilar': 'movieSimilar',
	'showSimilar': 'tvSimilar' };

class TMDB {
	constructor(cache, apiKey, tmdbLibrary) {
		this.cache = cache
		this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);
		this.cacheTags = {
			'search': 'se',
			'discover': 'd',
			'popular': 'p',
			'nowplaying': 'n',
			'upcoming': 'u',
			'similar': 'si',
			'lookup': 'l'
		}
	}

	/**
	* Retrive list of of items from TMDB matching the query and/or type given.
	* @param {queryText, page, type} the page number to specify in the request for discover,
	* @returns {Promise} dict with query results, current page and total_pages
	*/ 
	search(text, page = 1, type = 'multi') {
		const query = { 'query': text, 'page': page };
		const cacheKey = `${this.cacheTags.search}:${page}:${type}:${text}`;
		return Promise.resolve()
		 .then(() => this.cache.get(cacheKey))
		 .catch(() => this.tmdb(type, query))
		 .catch(() => { throw new Error('Could not search for movies/shows at tmdb.'); })
		 .then((response) => this.cache.set(cacheKey, response))
		 .then((response) => {
		 	try {
		 		let filteredTmdbItems = response.results.filter(function(tmdbResultItem) {
		 			return ((tmdbResultItem.vote_count >= 40 || tmdbResultItem.popularity > 8) && (tmdbResultItem.release_date !== undefined || tmdbResultItem.first_air_date !== undefined))
		 		})

		 		let seasonedItems = filteredTmdbItems.map((tmdbItem) => {
					if (type === 'movie')
						return convertTmdbToSeasoned(tmdbItem, 'movie');
					else if (type === 'show')
						return convertTmdbToSeasoned(tmdbItem, 'show');
					else
		 				return convertTmdbToSeasoned(tmdbItem);
		 		});
		 		
		 		// TODO add page number if results are larger than 20
		 		return { 'results': seasonedItems, 'number_of_items_on_page': seasonedItems.length,
						'page': 1, 'total_pages': 1 };

		 	} catch (parseError) {
		 		throw new Error('Could not parse result.');
		 	}
		 });
	}


	/**
	* Retrive list of discover section of movies from TMDB.
	* @param {Page, type} the page number to specify in the request for discover, 
	* and type for movie or show
	* @returns {Promise} dict with discover results, current page and total_pages
	*/ 
	discover(page, type='movie') {
		// Sets the tmdb function type to the corresponding type from query
		var tmdbType;
		if (type === 'movie') {
			tmdbType = 'discoverMovie';
		} else if (type === 'show') {
			tmdbType = 'discoverShow';
		} else {
			// Throw error if invalid type from query
			return Promise.resolve()
			.then(() => {
				throw new Error('Invalid type declaration.')
			})
		}

		// Build a query for tmdb with pagenumber
		const query = { 'page': page }
		const cacheKey = `${this.cacheTags.discover}:${page}:${type}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
			.catch(() => this.tmdb(tmdbType, query))
			.catch(() => { throw new Error('Could not fetch discover.'); })
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => {
				try {
					// Return a object that has the results and a variable for page, total_pages 
					// and seasonedResponse
					var seasonedResponse = response.results.map((result) => { 
						return convertTmdbToSeasoned(result, type); }
					);
					return { 'results': seasonedResponse,
						'page': response.page, 'total_pages': response.total_pages };
				} catch (error) {
					console.log(error)
					throw new Error('Error while parsing discover list.')
				}
			});
	}


	/**
	* Retrive list of popular section of movies or shows from TMDB.
	* @param {Page, type} the page number to specify in the request for popular, 
	* and type for movie or show
	* @returns {Promise} dict with popular results, current page and total_pages
	*/ 
	// TODO add filter for language
	popular(page, type='movie') {
		// Sets the tmdb function type to the corresponding type from query
		var tmdbType;
		if (type === 'movie') {
			tmdbType = 'popularMovies';
		} else if (type === 'show') {
			tmdbType = 'popularShows';
		} else {
			// Throw error if invalid type from query
			return Promise.resolve()
			.then(() => {
				throw new Error('Invalid type declaration.')
			})
		}

		// Build a query for tmdb with pagenumber
		const query = { 'page': page }
		const cacheKey = `${this.cacheTags.popular}:${page}:${type}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
			.catch(() => this.tmdb(tmdbType, query))
			.catch(() => { throw new Error('Could not fetch popular.'); })
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => {
				try {
					var seasonedResponse = response.results.map((result) => { 
						return convertTmdbToSeasoned(result, type); }
					);
					// Return a object that has the results and a variable for page, total_pages 
					// and seasonedResponse
					return { 'results': seasonedResponse,
						'page': response.page, 'total_pages': response.total_pages };
				} catch (error) {
					console.log(error)
					throw new Error('Error while parsing discover list.')
				}
			});
	}



	/**
	* Retrive list of now playing/airing section of movies or shows from TMDB.
	* @param {Page, type} the page number to specify in the request for now playing/airing, 
	* and type for movie or show
	* @returns {Promise} dict with nowplaying results, current page and total_pages
	*/ 
	// TODO add filter for language
	nowplaying(page, type='movie') {
		// Sets the tmdb function type to the corresponding type from query
		var tmdbType;
		if (type === 'movie') {
			tmdbType = 'nowPlayingMovies';
		} else if (type === 'show') {
			tmdbType = 'nowAiringShows';
		} else {
			// Throw error if invalid type from query
			return Promise.resolve()
			.then(() => {
				throw new Error('Invalid type declaration.')
			})
		}

		// Build a query for tmdb with pagenumber
		const query = { 'page': page }
		const cacheKey = `${this.cacheTags.nowplaying}:${page}:${type}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
			.catch(() => this.tmdb(tmdbType, query))
			.catch(() => { throw new Error('Could not fetch popular.'); })
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => {
				try {
					var seasonedResponse = response.results.map((result) => { 
						return convertTmdbToSeasoned(result, type); }
					);
					// Return a object that has the results and a variable for page, total_pages 
					// and seasonedResponse
					return { 'results': seasonedResponse,
						'page': response.page, 'total_pages': response.total_pages };
				} catch (error) {
					console.log(error)
					throw new Error('Error while parsing discover list.')
				}
			});
	}

	/**
	* Retrive list of upcoming movies from TMDB.
	* @param {Page} the page number to specify in the request for upcoming movies
	* @returns {Promise} dict with upcoming results, current page and total_pages
	*/ 
	// TODO add filter for language
	upcoming(page) {
		const query = { 'page': page }
		const cacheKey = `${this.cacheTags.upcoming}:${page}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
			.catch(() => this.tmdb('upcomingMovies', query))
			.catch(() => { throw new Error('Could not fetch upcoming movies.'); })
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => {
				try {
					var seasonedResponse = response.results.map((result) => { 
						return convertTmdbToSeasoned(result, 'movie'); }
					);
					// Return a object that has the results and a variable for page, total_pages 
					// and seasonedResponse
					return { 'results': seasonedResponse,
						'page': response.page, 'total_pages': response.total_pages };
				} catch (parseError) {
					throw new Error('Error while parsing upcoming movies list.')
				}
			});
	}


	/**
	* Retrive list of upcmoing movies from TMDB.
	* @param {Page} the page number to specify in the request for upcoming movies
	* @returns {Promise} dict with similar results, current page and total_pages
	*/ 
	// TODO add filter for language
	similar(identifier, type) {
		var tmdbType;
		if (type === 'movie') {
			tmdbType = 'movieSimilar';
		} else if (type === 'show') {
			tmdbType = 'showSimilar';
		} else {
			// Throw error if invalid type from query
			return Promise.resolve()
			.then(() => {
				throw new Error('Invalid type declaration.')
			})
		}

		const query = { id: identifier }
		const cacheKey = `${this.cacheTags.similar}:${type}:${identifier}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
			.catch(() => this.tmdb(tmdbType, query))
			.catch(() => { throw new Error('Could not fetch upcoming movies.'); })
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => {
				try {
					var seasonedResponse = response.results.map((result) => { 
						return convertTmdbToSeasoned(result, type); }
					);
					// Return a object that has the results and a variable for page, total_pages 
					// and seasonedResponse
					return { 'results': seasonedResponse,
						'page': response.page, 'total_pages': response.total_pages };
				} catch (parseError) {
					throw new Error('Error while parsing silimar media list.')
				}
			});
	}


	/**
	* Retrieve a specific movie by id from TMDB.
	* @param {Number} identifier of the movie you want to retrieve
	* @returns {Promise} succeeds if movie was found
	*/
	lookup(identifier, queryType = 'movie') {
		var type;
		if (queryType === 'movie') { type = 'movieInfo'}
		else if (queryType === 'show') { type = 'tvInfo'}
		else {
			return Promise.resolve()
			.then(() => {
				throw new Error('Invalid type declaration.')
			})
		}
		const query = { id: identifier };
		const cacheKey = `${this.cacheTags.lookup}:${type}:${identifier}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
			.catch(() => this.tmdb(type, query))
			.catch(() => { throw new Error('Could not find a movie with that id.'); })
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => {
			  try {
			    var car = convertTmdbToSeasoned(response, queryType);
			    console.log(car);
			    return car;
			  } catch (parseError) {
			    throw new Error('Could not parse movie.');
			  }
			});
	}

	// TODO ADD CACHE LOOKUP
	tmdb(method, argument) {
		return new Promise((resolve, reject) => {
			const callback = (error, reponse) => {
				if (error) {
					return reject(error);
				}
				resolve(reponse);
			};

			if (!argument) {
				this.tmdbLibrary[methodTypes[method]](callback);
				// this.tmdbLibrary['miscUpcomingMovies']
			} else {
				this.tmdbLibrary[methodTypes[method]](argument, callback);
			}
		})
	}
}

module.exports = TMDB;
