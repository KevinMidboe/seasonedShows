/*
 * @Author: KevinMidboe
 * @Date:   2017-10-21 09:54:31
 * @Last Modified by:   KevinMidboe
 * @Last Modified time: 2017-10-21 15:32:43
 */

import { AddMagnet } from "../../../pirate/pirateRepository.js";

function addMagnet(req, res) {
  const { magnet, name } = req.body;
  const tmdbId = req.body?.tmdb_id;

  AddMagnet(magnet, name, tmdbId)
    .then(result => res.send(result))
    .catch(error => {
      res
        .status(error?.statusCode || 500)
        .send({
          success: false,
          message: error?.message || "Unexpected error while adding magnet."
        });
    });
}

export default addMagnet;
