class Movie {
  constructor(id, title, year=undefined, overview=undefined, poster=undefined,
              backdrop=undefined, rank=undefined, genres=undefined, productionStatus=undefined,
              tagline=undefined, runtime=undefined, imdb_id=undefined, popularity) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.overview = overview;
    this.poster = poster;
    this.backdrop = backdrop;
    this.rank = rank;
    this.genres = genres;
    this.productionStatus = productionStatus;
    this.tagline = tagline;
    this.runtime = runtime;
    this.imdb_id = imdb_id;
    this.popularity = popularity;
    this.type = 'movie';
  }

  static convertFromTmdbResponse(response) {
    const { id, title, release_date, overview, poster_path, backdrop_path, rank, genres, status,
            tagline, runtime, imdb_id, popularity } = response;

    const year = new Date(release_date).getFullYear()
    const genreNames = genres ? genres.map(g => g.name) : undefined

    return new Movie(id, title, year, overview, poster_path, backdrop_path, rank, genreNames, status,
                     tagline, runtime, imdb_id, popularity)
  }

  static convertFromPlexResponse(response) {
    // console.log('response', response)
    const { title, year, rating, tagline, summary } = response;
    const _ = undefined

    return new Movie(null, title, year, summary, _, _, rating, _, _, tagline)
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
      production_status: this.productionStatus,
      tagline: this.tagline,
      runtime: this.runtime,
      imdb_id: this.imdb_id,
      type: this.type
    }
  }
}

module.exports = Movie;
