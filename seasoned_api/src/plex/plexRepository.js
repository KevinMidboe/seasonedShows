const assert = require('assert');
const convertPlexToSeasoned = require('src/plex/convertPlexToSeasoned');
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
		  	var seasonedMediaObjects = result.MediaContainer.Metadata.reduce(function(match, media_item) {
		  		if (media_item.type === 'movie' || media_item.type === 'show') {
		  			match.push(convertPlexToSeasoned(media_item));
		  		}
		  		return match;
		  	}, []);
		  	return seasonedMediaObjects;
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