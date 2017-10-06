const RequestRepository = require('src/searchHistory/searchHistory');
const requestRepository = new RequestRepository();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function updateRequested(req, res) {
  const id = req.params.requestId;
  const status = req.body.status;

  requestRepository.updateRequested(id, status)
  .then(() => {
    res.send({ success: true });
  })
  .catch((error) => {
    res.status(401).send({ success: false, error: error.message });
  });
}

module.exports = updateRequested;
