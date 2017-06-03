const assert = require('assert');
const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));
var Promise = require('bluebird');
var rp = require('request-promise');
var pythonShell = require('python-shell');

const establishedDatabase = require('src/database/database');

class RequestRepository {

	constructor(database) {
		this.database = database || establishedDatabase;
		this.queries = {
			// 'read': 'SELECT * FROM stray_eps WHERE id = ?',
			// 'readAll': 'SELECT id, name, season, episode, verified FROM stray_eps',
			// 'readAllFiltered': 'SELECT id, name, season, episode, verified FROM stray_eps WHERE verified = ',
			'checkRequested': 'SELECT id, title FROM request WHERE id = ?',
			'request': 'UPDATE request SET matched = 1 WHERE id = ?',
		};
	}

	searchRequest(query, page, type) {
		return Promise.resolve()
		.then(() => tmdb.search(query, page, type))
		.then((tmdbMovies) => {
			return Promise.resolve()
			.then(() => plexRepository.searchMedia(query))
			.then((plexMedia) => {
				return Promise.each(tmdbMovies, function(tmdbMovie) {
					return Promise.each(plexMedia, function(plexMovie) {
						if (tmdbMovie.title == plexMovie.title && tmdbMovie.year == plexMovie.year) {
							tmdbMovie.matchedInPlex = true;
							console.log(tmdbMovie.title + ' : ' + tmdbMovie.year);
						}
						return tmdbMovie;
					})
				})
			})
		})
		.catch((error) => {
			return error;
		});
	}

	lookup(identifier, type = 'movie') {
		if (type === 'movie') { type = 'movieInfo'}
			else if (type === 'tv') { type = 'tvInfo'}
		return Promise.resolve()
		.then(() => tmdb.lookup(identifier, type))
		.then((tmdbMovie) => {
			return Promise.resolve(plexRepository.searchMedia(tmdbMovie.title))
			.then((plexMovies) => {
				for (var i = 0; i < plexMovies.length; i++) {
					if (tmdbMovie.title === plexMovies[i].title && tmdbMovie.year === plexMovies[i].year) {
						tmdbMovie.matchedInPlex = true;
						return tmdbMovie;
					}
				}
			})
			.catch((error) => {
				return error;
			});
			return tmdbMovie;
		});
	}

	submitRequest(movieId) {
		console.log(movieId);
		return Promise.resolve()
			.then(() => {
				pythonShell.run('moveSeasoned.py', function (err, results) {
				  // if (err) throw err;
				  // TODO Add error handling!! StrayRepository.ERROR
				  // results is an array consisting of messages collected during execution
				  console.log('results: %j', results);
				})
			})
			.catch((error) => {
				console.log(error);
				return error;
			})

		// return this.database.get(this.queries.checkRequested, movieId).then((row) => {
		// 	// TODO send back the name, not ID
		// 	assert.notEqual(row, undefined, `Stray '${movieId}' already verified.`);

		// 	var options = {
		// 		args: [movieId]
		// 	}

			

		// 	return this.database.run(this.queries.verify, movieId);
		// })
	}

}

module.exports = RequestRepository;