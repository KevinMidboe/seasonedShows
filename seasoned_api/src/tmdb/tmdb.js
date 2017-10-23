const moviedb = require('moviedb');
const convertTmdbToSeasoned = require('src/tmdb/convertTmdbToSeasoned');
var methodTypes = { 'movie': 'searchMovie', 'show': 'searchTv', 'multi': 'searchMulti', 'movieInfo': 'movieInfo', 
	'tvInfo': 'tvInfo', 'upcomingMovies': 'miscUpcomingMovies', 'discoverMovie': 'discoverMovie', 
	'discoverShow': 'discoverTv', 'popularMovies': 'miscPopularMovies', 'popularShows': 'miscPopularTvs',
	'nowPlayingMovies': 'miscNowPlayingMovies', 'nowAiringShows': 'tvOnTheAir', 'movieSimilar': 'movieSimilar',
	'showSimilar': 'tvSimilar' };


const TYPE_LIST = ['upcoming', 'discover', 'popular', 'nowplaying', 'similar']
const TMDB_TYPE_LIST = {
	'upcomingmovie': 'miscUpcomingMovies', 'discovermovie': 'discoverMovie', 
	'discovershow': 'discoverTv', 'popularmovie': 'miscPopularMovies',
	'popularshow': 'miscPopularTvs', 'nowplayingmovie': 'miscNowPlayingMovies', 
	'nowplayingshow': 'tvOnTheAir', 'similarmovie': 'movieSimilar', 'similarshow': 'tvSimilar',
};

class TMDB {
	constructor(cache, apiKey, tmdbLibrary) {
		this.cache = cache
		this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);
		this.cacheTags = {
			'search': 'se',
			'info': 'i',
			'upcoming': 'u',
			'discover': 'd',
			'popular': 'p',
			'nowplaying': 'n',
			'similar': 'si',
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
		 .catch(() => this.tmdb(methodTypes[type], query))
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

	/**
	* Verifies that a list_name corresponds to a tmdb list and calls the tmdb
	* api with list name and paramters. 
	* @param {list_name} The name of a list we want to search for.
	* @param {media_type} The type declared in listSearch.
	* @param {params} Params is page and id given as parameters in listSearch.
	* @returns {Promise} dict with raw tmdb results.
	*/ 
	searchTmdbList(list_name, media_type, params) {
		return new Promise((resolve, reject) => {
			if (TYPE_LIST.includes(list_name) && ['movie', 'show'].includes(media_type)) {
				const searchQuery = list_name.toLowerCase() + media_type.toLowerCase();
				const tmdbList = TMDB_TYPE_LIST[searchQuery]
				
				return Promise.resolve()
				.then(() => this.tmdb(tmdbList, params))
				.then((response) => {
					resolve(response)
				})
				.catch(() => {
					return reject('Error while fetching from tmdb list.')
				})
			}
			return reject('Did not find tmdb list matching query.')
		})
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
			const mappedResults = response.results.map((result) => {
				return convertTmdbToSeasoned(result, type)
			})

			return [mappedResults, response.page, response.total_pages]
		})
		.catch((error) => { throw new Error(error)})

		
	}

	/**
	* Fetches a given list from tmdb.
	* @param {list_name} List we want to fetch.
	* @param {media_type} The  to specify in the request for discover (default 'movie').
	* @param {id} When finding similar a id can be added to query
	* @param {page} Page number we want to fetch.
	* @returns {Promise} dict with query results, current page and total_pages
	*/ 
	listSearch(list_name, media_type='movie', id, page='1') {
		const params = {'id': id, 'page': page}
		const cacheKey = `${this.cacheTags[list_name]}:${media_type}:${id}:${page}`;
		return Promise.resolve()
		 	.then(() => this.cache.get(cacheKey))
		 	.catch(() => this.searchTmdbList(list_name, media_type, params))
			.then((response) => this.cache.set(cacheKey, response))
			.then((response) => this.mapResults(response, media_type))
			.catch((error) => { throw new Error(error); })
			.then(([mappedResults, pagenumber, totalpages]) => {
				return {'results': mappedResults, 'page': pagenumber, 'total_pages': totalpages}
			})
	}

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
		})
	}
}

module.exports = TMDB;
