class Movie {
  constructor(title, year) {
    this.title = title;
    this.year = year;
    this.summary = null;
    this.rating = null;
    this.tagline = null;
    this.type = 'movie';
  }
}

module.exports = Movie;