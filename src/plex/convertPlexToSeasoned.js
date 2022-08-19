const Plex = require("../media_classes/plex");

function translateAdded(date_string) {
  return new Date(date_string * 1000);
}

function convertPlexToSeasoned(plex) {
  const { title } = plex;
  const { year } = plex;
  const { type } = plex;
  const { summary } = plex;
  const poster_path = plex.thumb;
  const background_path = plex.art;
  const added = translateAdded(plex.addedAt);
  // const genre = plex.genre;
  const seasons = plex.childCount;
  const episodes = plex.leafCount;

  const seasoned = new Plex(
    title,
    year,
    type,
    summary,
    poster_path,
    background_path,
    added,
    seasons,
    episodes
  );
  // seasoned.print();
  return seasoned;
}

module.exports = convertPlexToSeasoned;
