const RequestRepository = require('src/request/request');
const request = new RequestRepository();

/**
 * Controller: Request by id with type param
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function requestTmdbIdController(req, res) {
  let { filter, sort, query } = req.query;
  let sort_by = sort;
  let sort_direction = undefined;

  if (sort !== undefined && sort.includes(':')) {
    [sort_by, sort_direction] = sort.split(':')
  }

  Promise.resolve()
  .then(() => request.fetchAll(sort_by, sort_direction, filter, query))
  .then((result) => res.send(result))
  .catch((error) => {
    res.status(404).send({ success: false, error: error.message });
  });
}

module.exports = requestTmdbIdController;
