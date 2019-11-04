const Episode = require('src/plex/types/episode');

function convertPlexToEpisode(plexEpisode) {
  const episode = new Episode(plexEpisode.title, plexEpisode.grandparentTitle, plexEpisode.year);
  episode.season = plexEpisode.parentIndex;
  episode.episode = plexEpisode.index;
  episode.summary = plexEpisode.summary;
  episode.rating = plexEpisode.rating;

  if (plexEpisode.viewCount !== undefined) {
    episode.views = plexEpisode.viewCount;
  }

  if (plexEpisode.originallyAvailableAt !== undefined) {
    episode.airdate = new Date(plexEpisode.originallyAvailableAt)
  }

  return episode;
}
module.exports = convertPlexToEpisode;
