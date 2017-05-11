const assert = require('assert');
const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));
var Promise = require('bluebird');
var rp = require('request-promise');

class RequestRepository {

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

}

module.exports = RequestRepository;