import RequestRepository from "../../../plex/requestRepository.js";

const requestRepository = new RequestRepository();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function fetchRequestedController(req, res) {
  // const user = req.loggedInUser;
  const { status, page } = req.query;

  requestRepository
    .fetchRequested(status, page)
    .then(requestedItems => {
      res.send({
        success: true,
        results: requestedItems,
        total_results: requestedItems.length
      });
    })
    .catch(error => {
      res.status(401).send({ success: false, message: error.message });
    });
}

export default fetchRequestedController;
