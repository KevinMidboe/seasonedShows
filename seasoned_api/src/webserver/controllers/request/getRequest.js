const RequestRepository = require('src/request/request');
const request = new RequestRepository();

/**
 * Controller: Get requested item by tmdb id and type
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function fetchAllRequests(req, res) {
  const id = req.params.id;
  const { type } = req.query;

  request.getRequestByIdAndType(id, type)
    .then(result => res.send(result))
    .catch(error => {
      res.status(404).send({ success: false, error: error.message });
    });
}

module.exports = fetchAllRequests;
