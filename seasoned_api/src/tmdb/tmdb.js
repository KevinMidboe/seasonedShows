const moviedb = require('moviedb');
const convertTmdbToMovie = require('src/tmdb/convertTmdbToMovie');
var methodTypes = { 'movie': 'searchMovie', 'tv': 'searchTv', 'multi': 'searchMulti', 'movieInfo': 'movieInfo', 
	'tvInfo': 'tvInfo' };

class TMDB {
	constructor(apiKey, tmdbLibrary) {
		this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);
	}

	search(text, page = 1, type = 'multi') {
		const query = { query: text, page };
		return Promise.resolve()
		 .then(() => this.tmdb(type, query))
		 .catch(() => { throw new Error('Could not search for movies.'); })
		 .then((reponse) => {
		 	try {
		 		return reponse.results.filter(function(item) {
		 			return (item.popularity >= 1.15)
		 		}).map(convertTmdbToMovie);
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
	lookup(identifier, type = 'movie') {
		if (type === 'movie') { type = 'movieInfo'}
			else if (type === 'tv') { type = 'tvInfo'}
		const query = { id: identifier };
		return Promise.resolve()
		.then(() => this.tmdb(type, query))
		.catch(() => { throw new Error('Could not find a movie with that id.'); })
		.then((response) => {
		  try {
		    return convertTmdbToMovie(response);
		  } catch (parseError) {
		    throw new Error('Could not parse movie.');
		  }
		});
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
				this.tmdbLibrary[methodTypes[method]](callback);
			} else {
				this.tmdbLibrary[methodTypes[method]](argument, callback);
			}
		})
	}
}

module.exports = TMDB;