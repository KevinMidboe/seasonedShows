const RequestRepository = require('src/plex/requestRepository.js');

const requestRepository = new RequestRepository();

/**
 * Controller: Retrieves requested items of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestsController(req, res) {
   const user = req.loggedInUser;

   requestRepository.userRequests(user)
      .then(requests => {
         res.send({ success: true, results: requests, total_results: requests.length });
      })
      .catch(error => {
         res.status(500).send({ success: false, message: error.message });
      });
}

module.exports = requestsController;
