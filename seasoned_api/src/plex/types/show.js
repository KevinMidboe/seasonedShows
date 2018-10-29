class Show {
  constructor(title, year) {
    this.title = title;
    this.year = year;
    this.summary = null;
    this.rating = null;
    this.seasons = null;
    this.episodes = null;
    this.type = 'show';
  }
}

module.exports = Show;