const moviedb = require('moviedb');
const convertTmdbToMovie = require('src/tmdb/convertTmdbToMovie');

class TMDB {
	constructor(apiKey, tmdbLibrary) {
		this.tmdbLibrary = tmdbLibrary || moviedb(apiKey);
	}

	search(text, page = 1) {
		const query = { query: text, page };
		return Promise.resolve()
		 .then(() => this.tmdb('searchMovie', query))
		 .catch(() => { throw new Error('Could not search for movies.'); })
		 .then((reponse) => {
		 	try {
		 		return reponse.results.map(convertTmdbToMovie);
		 	} catch (parseError) {
		 		throw new Error('Could not parse result.');
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
				this.tmdbLibrary[method](callback);
			} else {
				this.tmdbLibrary[method](argument, callback);
			}
		})
	}
}

module.exports = TMDB;