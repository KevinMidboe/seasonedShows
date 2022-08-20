class Episode {
  constructor(title, show, year) {
    this.title = title;
    this.show = show;
    this.year = year;
    this.season = null;
    this.episode = null;
    this.summary = null;
    this.rating = null;
    this.views = null;
    this.aired = null;
    this.type = "episode";
  }
}

module.exports = Episode;
