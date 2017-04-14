const configuration = require('src/config/configuration').getInstance();
const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();

function searchMediaController(req, res) {
	const { query } = req.query;

	plexRepository.searchMedia(query)
	.then((movies) => {
		res.send(movies);
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	})
}

module.exports = searchMediaController;