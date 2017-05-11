const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();

function searchMediaController(req, res) {
	const { query, page } = req.query;
	console.log(query);

	plexRepository.searchMedia(query)
	.then((movies) => {
		res.send(movies);
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	})
}

module.exports = searchMediaController;