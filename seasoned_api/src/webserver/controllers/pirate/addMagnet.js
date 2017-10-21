
/*
* @Author: KevinMidboe
* @Date:   2017-10-21 09:54:31
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-21 15:22:40
*/

const PirateRepository = require('src/pirate/pirateRepository');

function updateRequested(req, res) {
  const magnet = req.body.magnet;

  PirateRepository.AddMagnet(magnet)
  .then((result) => {
    res.send({result);
  })
  .catch((error) => {
    res.status(401).send({ success: false, error: error.message });
  });
}

module.exports = updateRequested;
