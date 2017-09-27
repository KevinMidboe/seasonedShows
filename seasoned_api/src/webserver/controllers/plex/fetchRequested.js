const RequestRepository = require('src/plex/requestRepository.js');
const requestRepository = new RequestRepository();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function historyController(req, res) {
  const user = req.loggedInUser;

  requestRepository.fetchRequested()
  .then((requestedItems) => {
    res.send({ success: true, requestedItems });
  })
  .catch((error) => {
    res.status(401).send({ success: false, error: error.message });
  });
}

module.exports = historyController;
