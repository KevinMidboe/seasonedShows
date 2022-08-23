/* eslint-disable camelcase */

import Media from "./media.js";

class Plex extends Media {
  constructor(
    title,
    year,
    type,
    summary,
    poster_path,
    background_path,
    added,
    seasons,
    episodes
  ) {
    super(title, year, type);

    this.summary = summary;
    this.poster_path = poster_path;
    this.background_path = background_path;
    this.added = added;

    this.seasons = seasons;
    this.episodes = episodes;
  }

  print() {
    super.print();
  }
}

export default Plex;
