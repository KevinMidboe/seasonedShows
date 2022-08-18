const Media = require("./media");

class TMDB extends Media {
  // constructor(...args) {
  constructor(
    title,
    year,
    type,
    id,
    summary,
    poster_path,
    background_path,
    popularity,
    score,
    release_status,
    tagline,
    seasons,
    episodes
  ) {
    super(title, year, type);

    this.id = id;
    this.summary = summary;
    this.poster_path = poster_path;
    this.background_path = background_path;
    this.popularity = popularity;
    this.score = score;

    this.release_status = release_status;
    this.tagline = tagline;

    this.seasons = seasons;
    this.episodes = episodes;
  }

  toString() {
    return `${super.toString()} | ID: ${this.id}`;
  }

  print() {
    /* eslint-disable no-console */
    console.log(this.toString());
  }
}

module.exports = TMDB;
