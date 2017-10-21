const assert = require('assert');

class PirateRepository {

	search(query) {
		console.log(query)
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
}

module.exports = PirateRepository;