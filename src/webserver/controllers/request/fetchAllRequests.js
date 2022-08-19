const RequestRepository = require("../../../request/request");
const request = new RequestRepository();

/**
 * Controller: Fetch all requested items
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function fetchAllRequests(req, res) {
  let { page, filter, sort, query } = req.query;
  let sort_by = sort;
  let sort_direction = undefined;

  if (sort !== undefined && sort.includes(":")) {
    [sort_by, sort_direction] = sort.split(":");
  }

  Promise.resolve()
    .then(() => request.fetchAll(page, sort_by, sort_direction, filter, query))
    .then(result => res.send(result))
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
}

module.exports = fetchAllRequests;
