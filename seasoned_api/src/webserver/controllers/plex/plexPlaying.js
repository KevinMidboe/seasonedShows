const PlexRepository = require('src/plex/plexRepository');

const plexRepository = new PlexRepository();

function playingController(req, res) {
   plexRepository.nowPlaying()
      .then((movies) => {
         res.send(movies);
      })
      .catch((error) => {
         res.status(500).send({ success: false, error: error.message });
      });
}

module.exports = playingController;
