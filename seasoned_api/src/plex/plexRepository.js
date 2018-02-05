const assert = require('assert');
const convertPlexToSeasoned = require('src/plex/convertPlexToSeasoned');
const convertPlexToStream = require('src/plex/convertPlexToStream');
var rp = require('request-promise');

const PLEX_METHODS = ['lookup', 'playing']

class PlexRepository {

	search(query, callback) {
		var options = {
			uri: 'http://10.0.0.44:32400/search?query=' + query,
			headers: {
				'Accept': 'application/json'
			},
			json: true
		}

		return rp(options)
		.then((result) => this.mapResults(result))
		.then(([mappedResults, resultCount]) => {
			return { 'results': mappedResults, 'total_results': resultCount }
		})
	}

	compareTmdbToPlex(tmdb, plexResult) {
		return Promise.resolve()
		.then(() => {
			plexResult.results.map((plexItem) => {
				if (tmdb.title === plexItem.title && tmdb.year === plexItem.year)
					tmdb.matchedInPlex = true;
			})
			return tmdb
		})
	}

	inPlex(tmdbResult) {
		return Promise.resolve()
		.then(() => this.search(tmdbResult.title))
		.then((plexResult) => this.compareTmdbToPlex(tmdbResult, plexResult))
	}

	mapResults(response) {
		return Promise.resolve()
		.then(() => {
			if (! response.MediaContainer.hasOwnProperty('Metadata')) return [[], 0]

			const mappedResults = response.MediaContainer.Metadata.filter((element) => {
				return (element.type === 'movie' || element.type === 'show')
			}).map((element) => convertPlexToSeasoned(element))
			return [mappedResults, mappedResults.length]
		})
		.catch((error) => {throw new Error(error)})
	}

	nowPlaying() {
		var options = {
			uri: 'http://10.0.0.44:32400/status/sessions',
			headers: {
				'Accept': 'application/json'
			},
			json: true
		}

		return rp(options)
		  .then((result) => {
		  	  if (result.MediaContainer.size > 0) {
			  	var playing = result.MediaContainer.Video.map(convertPlexToStream);
			  	return {'size': Object.keys(playing).length, 'video': playing };
			  } else {
			  	return { 'size': 0, 'video': [] };
			  }
		  })
		  .catch((err) => {
		  	throw new Error('Error handling plex playing. Error: ' + err);
		  })
	}

	// multipleInPlex(tmdbResults) {
	// 	const results = tmdbResults.results.map(async (tmdb) => {
	// 		return this.inPlex(tmdb)
	// 	})
	// 	return Promise.all(results)
	// }
}

module.exports = PlexRepository;
