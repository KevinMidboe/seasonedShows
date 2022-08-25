import PlexRepository from "../../../plex/plexRepository.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();

const plexRepository = new PlexRepository(
  configuration.get("plex", "ip"),
  configuration.get("plex", "token")
);

function playingController(req, res) {
  plexRepository
    .nowPlaying()
    .then(movies => {
      res.send(movies);
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

export default playingController;
