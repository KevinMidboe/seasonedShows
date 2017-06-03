const RequestRepository = require('src/plex/requestRepository');
const requestRepository = new RequestRepository();

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function readRequestController(req, res) {
  const requestId = req.params.requestId;
  const { type } = req.query;
  
  requestRepository.lookup(requestId, type)
  .then((movies) => {
    res.send(movies);
  }).catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = readRequestController;
