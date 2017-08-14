const RequestRepository = require('src/plex/requestRepository.js');
const requestRepository = new RequestRepository();

function searchRequestController(req, res) {
	const { query, page, type } = req.query;
	console.log('searchReq: ' + query, page, type);

	requestRepository.searchRequest(query, page, type)
	.then((movies) => {
		// Verify that respond has content, if so send the content back
		if (movies.length > 0 && movies != null) {
			res.send(movies);
		}
		// If no content was found, send 404 status and error message
		else {
			res.status(404).send({success: false, error: 'Search query did not return any results.'})
		}
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	})
}

module.exports = searchRequestController;