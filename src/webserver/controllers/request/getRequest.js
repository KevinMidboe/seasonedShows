import RequestRepository from "../../../request/request.js";

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
    .then(result => {
      if (!result) {
        return res.send({
          success: false,
          message: `Item ${type} with id ${id} has not been requested`
        });
      }

      return res.send({
        success: true,
        result
      });
    })
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting request with id: ${id}`
      });
    });
}

export default fetchAllRequests;
