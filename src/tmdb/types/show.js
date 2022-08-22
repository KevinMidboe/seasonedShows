/* eslint-disable camelcase */

class Show {
  constructor(
    id,
    title,
    year = undefined,
    overview = undefined,
    poster = undefined,
    backdrop = undefined,
    seasons = undefined,
    episodes = undefined,
    rank = undefined,
    genres = undefined,
    status = undefined,
    runtime = undefined
  ) {
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
    this.productionStatus = status;
    this.runtime = runtime;
    this.type = "show";
  }

  static convertFromTmdbResponse(response) {
    const {
      id,
      name,
      first_air_date,
      overview,
      poster_path,
      backdrop_path,
      number_of_seasons,
      number_of_episodes,
      rank,
      genres,
      status,
      episode_run_time,
      popularity
    } = response;

    const year = new Date(first_air_date).getFullYear();
    const genreNames = genres ? genres.map(g => g.name) : undefined;

    return new Show(
      id,
      name,
      year,
      overview,
      poster_path,
      backdrop_path,
      number_of_seasons,
      number_of_episodes,
      rank,
      genreNames,
      status,
      episode_run_time,
      popularity
    );
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
      production_status: this.productionStatus,
      runtime: this.runtime,
      type: this.type
    };
  }
}

export default Show;
