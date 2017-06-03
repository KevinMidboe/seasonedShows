const configuration = require('src/config/configuration').getInstance();
const RequestRepository = require('src/plex/requestRepository');
const requestRepository = new RequestRepository();

function submitRequestController(req, res) {
	const id = req.params.requestId;

	requestRepository.submitRequest(id)
	.then(() => {
		// Better sendback message.
		res.send({ success: true, message: 'Request sent' });
	})
	.catch((error) => {
		res.status(500).send({ success: false, error: error.message });
	});
}

module.exports = submitRequestController;
