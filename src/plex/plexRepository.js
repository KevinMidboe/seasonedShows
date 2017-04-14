const assert = require('assert');
var request = require('request');

class PlexRepository {

	read(strayId) {
		return this.database.get(this.queries.read, strayId).then((row) => {
			assert.notEqual(row, undefined, `Could not find list with id ${strayId}.`);
			return row;
		})
	}

	searchMedia(query) {
		request
			.get('10.0.0.41:32400/search?query=' + query)
			.on('response', function(response) {
				console.log(response.statusCode);
				return response;
			})
	}
}

module.exports = PlexRepository;