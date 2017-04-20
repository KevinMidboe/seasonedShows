const assert = require('assert');
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
var rp = require('request-promise');

class PlexRepository {

	read(strayId) {
		return this.database.get(this.queries.read, strayId).then((row) => {
			assert.notEqual(row, undefined, `Could not find list with id ${strayId}.`);
			return row;
		})
	}

	searchMedia(query) {
		var options = {
			uri: 'http://10.0.0.41:32400/search?query=' + query,
			headers: {
				'Accept': 'application/json'
			},
			json: true
		}

		return rp(options)
		  .then((result) => {
		  	return result.MediaContainer.Metadata.map(convertPlexToMovie);
		  })
		  .catch((err) => {
		  	throw new Error(err);
		  })
	}
}

module.exports = PlexRepository;