import RequestRepository from "../../../plex/requestRepository.js";

const requestRepository = new RequestRepository();

/**
 * Controller: Retrieve information for a movie
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function readRequestController(req, res) {
  const { mediaId } = req.params;
  const { type } = req.query;
  requestRepository
    .lookup(mediaId, type)
    .then(movies => {
      res.send(movies);
    })
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
}

export default readRequestController;
