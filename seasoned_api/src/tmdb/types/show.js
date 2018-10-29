class Show {
  constructor(id, title, year=null, seasons=null, episodes=null, overview=null, rank=null, genres=null, 
              poster=null, backdrop=null, status=null, runtime=null) { 
    this.id = id;
    this.title = title;
    this.year = year;
    this.seasons = seasons;
    this.episodes = episodes;
    this.overview = overview;
    this.rank = rank;
    this.genres = genres;
    this.poster = poster;
    this.backdrop = backdrop;
    this.status = status;
    this.runtime = runtime;
    this.type = 'show';
  }
}

module.exports = Show;
