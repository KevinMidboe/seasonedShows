import RequestRepository from "../../../request/request.js";

const request = new RequestRepository();

/**
 * Controller: Fetch all requested items
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function fetchAllRequests(req, res) {
  const { page, filter } = req.query;

  request
    .fetchAll(page, filter)
    .then(result => res.send(result))
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while requesting all requests`
      });
    });
}

export default fetchAllRequests;
