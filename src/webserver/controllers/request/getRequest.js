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
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting request with id: ${id}`
      });
    });
}

module.exports = fetchAllRequests;
