class Show {
  constructor(id, title, year=null, overview=null, poster=null, backdrop=null,
              seasons=null, episodes=null, rank=null, genres=null, status=null,
              runtime=null) { 
    this.id = id;
    this.title = title;
    this.year = year;
    this.overview = overview;
    this.poster = poster;
    this.backdrop = backdrop;
    this.seasons = seasons;
    this.episodes = episodes;
    this.rank = rank;
    this.genres = genres;
    this.status = status;
    this.runtime = runtime;
    this.type = 'show';
  }

  createJsonResponse() {
    return {
      id: this.id,
      title: this.title,
      year: this.year,
      overview: this.overview,
      poster: this.poster,
      backdrop: this.backdrop,
      seasons: this.seasons,
      episodes: this.episodes,
      rank: this.rank,
      genres: this.genres,
      status: this.status,
      runtime: this.runtime,
      // imdb_id: this.imdb_id,
      type: this.type
     }
  }
}

module.exports = Show;
