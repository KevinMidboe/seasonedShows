const RequestRepository = require('src/plex/requestRepository');

const requestRepository = new RequestRepository();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function updateRequested(req, res) {
   const id = req.params.requestId;
   const type = req.body.type;
   const status = req.body.status;

   requestRepository.updateRequestedById(id, type, status)
      .then(() => {
         res.send({ success: true });
      })
      .catch((error) => {
         res.status(401).send({ success: false, message: error.message });
      });
}

module.exports = updateRequested;
