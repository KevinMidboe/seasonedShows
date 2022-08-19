/* eslint-disable camelcase */

class Movie {
  constructor(
    id,
    title,
    year = undefined,
    overview = undefined,
    poster = undefined,
    backdrop = undefined,
    releaseDate = undefined,
    rating = undefined,
    genres = undefined,
    productionStatus = undefined,
    tagline = undefined,
    runtime = undefined,
    imdb_id = undefined,
    popularity = undefined
  ) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.overview = overview;
    this.poster = poster;
    this.backdrop = backdrop;
    this.releaseDate = releaseDate;
    this.rating = rating;
    this.genres = genres;
    this.productionStatus = productionStatus;
    this.tagline = tagline;
    this.runtime = runtime;
    this.imdb_id = imdb_id;
    this.popularity = popularity;
    this.type = "movie";
  }

  static convertFromTmdbResponse(response) {
    const {
      id,
      title,
      release_date,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
      genres,
      status,
      tagline,
      runtime,
      imdb_id,
      popularity
    } = response;

    const releaseDate = new Date(release_date);
    const year = releaseDate.getFullYear();
    const genreNames = genres ? genres.map(g => g.name) : undefined;

    return new Movie(
      id,
      title,
      year,
      overview,
      poster_path,
      backdrop_path,
      releaseDate,
      vote_average,
      genreNames,
      status,
      tagline,
      runtime,
      imdb_id,
      popularity
    );
  }

  static convertFromPlexResponse(response) {
    // console.log('response', response)
    const { title, year, rating, tagline, summary } = response;
    const _ = undefined;

    return new Movie(
      null,
      title,
      year,
      summary,
      _,
      _,
      _,
      rating,
      _,
      _,
      tagline
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
      release_date: this.releaseDate,
      rating: this.rating,
      genres: this.genres,
      production_status: this.productionStatus,
      tagline: this.tagline,
      runtime: this.runtime,
      imdb_id: this.imdb_id,
      type: this.type
    };
  }
}

module.exports = Movie;
