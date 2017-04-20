const assert = require('assert');
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
var rp = require('request-promise');

class PlexRepository {

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