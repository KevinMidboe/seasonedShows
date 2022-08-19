/*
 * @Author: KevinMidboe
 * @Date:   2017-10-21 09:54:31
 * @Last Modified by:   KevinMidboe
 * @Last Modified time: 2017-10-21 15:32:43
 */

const PirateRepository = require("../../../pirate/pirateRepository");

function addMagnet(req, res) {
  const { magnet, name } = req.body;
  const tmdbId = req.body?.tmdb_id;

  PirateRepository.AddMagnet(magnet, name, tmdbId)
    .then(result => res.send(result))
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

module.exports = addMagnet;
