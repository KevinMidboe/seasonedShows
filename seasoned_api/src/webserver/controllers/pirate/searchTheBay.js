/*
* @Author: KevinMidboe
* @Date:   2017-10-21 09:54:31
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-21 12:12:26
*/

const PirateRepository = require('src/pirate/pirateRepository');
// const pirateRepository = new PirateRepository();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function updateRequested(req, res) {
  const { query, page, type } = req.query;

  PirateRepository.SearchPiratebay(query, page, type)
  .then((result) => {
    res.send({ success: true, torrents: result });
  })
  .catch((error) => {
    res.status(401).send({ success: false, error: error.message });
  });
}

module.exports = updateRequested;