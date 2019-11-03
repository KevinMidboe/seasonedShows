
/*
* @Author: KevinMidboe
* @Date:   2017-10-21 09:54:31
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-21 15:32:43
*/

const PirateRepository = require('src/pirate/pirateRepository');

function addMagnet(req, res) {
   const magnet = req.body.magnet;
   const name = req.body.name;
   const tmdb_id = req.body.tmdb_id;

   PirateRepository.AddMagnet(magnet, name, tmdb_id)
      .then((result) => {
         res.send(result);
      })
      .catch(error => {
         res.status(500).send({ success: false, message: error.message });
      });
}

module.exports = addMagnet;
