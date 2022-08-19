const RequestRepository = require("../../../request/request");

const request = new RequestRepository();

/**
 * Controller: Get requested item by tmdb id and type
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function fetchAllRequests(req, res) {
  const { id } = req.params;
  const { type } = req.query;

  request
    .getRequestByIdAndType(id, type)
    .then(result => res.send(result))
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
}

module.exports = fetchAllRequests;
