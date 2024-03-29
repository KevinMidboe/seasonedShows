/*
 * @Author: KevinMidboe
 * @Date:   2017-10-21 09:54:31
 * @Last Modified by:   KevinMidboe
 * @Last Modified time: 2018-02-26 19:56:32
 */

import { SearchPiratebay } from "../../../pirate/pirateRepository.js";
// const pirateRepository = new PirateRepository();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function updateRequested(req, res) {
  const { query, page, type } = req.query;

  SearchPiratebay(query, page, type)
    .then(result => {
      res.send({ success: true, results: result });
    })
    .catch(error => {
      res.status(error?.statusCode || 500).send({
        success: false,
        message: error?.message || "Unexpected error while searching."
      });
    });
}

export default updateRequested;
