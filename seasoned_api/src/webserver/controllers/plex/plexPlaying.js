const PlexRepository = require('src/plex/plexRepository');
const configuration = require('src/config/configuration').getInstance();

const plexRepository = new PlexRepository(onfiguration.get('plex', 'ip'));

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
