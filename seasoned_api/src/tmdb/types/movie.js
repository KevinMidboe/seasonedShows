class Movie {
  constructor(id, title, year=null, overview=null, poster=null, backdrop=null, rank=null, genres=null, status=null,
              tagline=null, runtime=null, imdb_id=null) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.overview = overview;
    this.poster = poster;
    this.backdrop = backdrop;
    this.rank = rank;
    this.genres = genres;
    this.status = status;
    this.tagline = tagline;
    this.runtime = runtime;
    this.imdb_id = imdb_id;
    this.type = 'movie';
  }
}

module.exports = Movie;
