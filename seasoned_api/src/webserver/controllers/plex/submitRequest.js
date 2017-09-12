const RequestRepository = require('src/plex/requestRepository.js');
const requestRepository = new RequestRepository();

/**
 * Controller: POST a media id to be donwloaded
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

function submitRequestController(req, res) {
	// This is the id that is the param of the url
	const id = req.params.mediaId;
	const type = req.query.type;

	requestRepository.sendRequest(id, type)
	.then(() => {
		res.send({ success: true, message: 'Media item sucessfully requested!' });
	})
	.catch((error) => {
		res.status(500).send({ success: false, error: error.message });
	});
}

module.exports = submitRequestController;