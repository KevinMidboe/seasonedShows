const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();

/**
 * Controller: Search for media and check existence 
 * in plex by query and page
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function searchMediaController(req, res) {
	const { query, page } = req.query;

	plexRepository.searchMedia(query)
	.then((media) => {
		if (media !== undefined || media.length > 0) {
  		res.send(media);
  	} else {
  		res.status(404).send({ success: false, error: 'Search query did not return any results.'})
  	}
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	})
}

module.exports = searchMediaController;