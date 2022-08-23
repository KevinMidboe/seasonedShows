import RequestRepository from "../../../plex/requestRepository.js";

const requestRepository = new RequestRepository();

/**
 * Controller: Retrieves requested items of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestsController(req, res) {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  requestRepository
    .userRequests(username)
    .then(requests => {
      res.send({
        success: true,
        results: requests,
        total_results: requests.length
      });
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

export default requestsController;
