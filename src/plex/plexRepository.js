const assert = require('assert');
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
const convertPlexToStream = require('src/plex/convertPlexToStream');
const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));
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

	nowPlaying() {
		var options = {
			uri: 'http://10.0.0.41:32400/status/sessions',
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
		  	throw new Error(err);
		  })
	}
}

module.exports = PlexRepository;