class Movie {
  constructor(id, title, year=undefined, overview=undefined, poster=undefined,
              backdrop=undefined, rank=undefined, genres=undefined, status=undefined,
              tagline=undefined, runtime=undefined, imdb_id=undefined) {
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

  createJsonResponse() {
    return {
      id: this.id,
      title: this.title,
      year: this.year,
      overview: this.overview,
      poster: this.poster,
      backdrop: this.backdrop,
      rank: this.rank,
      genres: this.genres,
      status: this.status,
      tagline: this.tagline,
      runtime: this.runtime,
      imdb_id: this.imdb_id,
      type: this.type
    }
  }
}

module.exports = Movie;
