const RequestRepository = require('src/plex/requestRepository.js');
const requestRepository = new RequestRepository();

function searchRequestController(req, res) {
	const { query, page, type } = req.query;
	console.log('searchReq: ' + query, page, type);

	requestRepository.searchRequest(query, page, type)
	.then((movies) => {
		res.send(movies);
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	})
}

module.exports = searchRequestController;