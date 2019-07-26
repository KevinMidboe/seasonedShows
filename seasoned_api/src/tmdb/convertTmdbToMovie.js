const Movie = require('src/tmdb/types/movie');

const tmdbSwitcher = (tmdbMovie, property) => tmdbMovie[property]

function convertTmdbToMovie(tmdbMovie, credits=undefined) {
  const movie = new Movie(tmdbMovie.id, tmdbMovie.title)
  movie.overview = tmdbMovie.overview;
  movie.rank = tmdbMovie.vote_average;

  if (credits) {
    movie.credits = credits;
  }

  if (tmdbMovie.release_date !== undefined  && tmdbMovie.genres) {
    movie.release_date = new Date(tmdbMovie.release_date);
    movie.year = movie.release_date.getFullYear();
  }

  if (tmdbMovie.poster_path !== undefined  && tmdbMovie.genres) {
    movie.poster = tmdbMovie.poster_path;
  }
  if (tmdbMovie.backdrop_path !== undefined  && tmdbMovie.genres) {
    movie.backdrop = tmdbMovie.backdrop_path;
  }

  if (tmdbMovie.status !== undefined  && tmdbMovie.genres) {
    movie.status = tmdbMovie.status;
  }

  if (tmdbMovie.genres !== undefined  && tmdbMovie.genres) {
    movie.genres = tmdbMovie.genres.map(genre => genre.name);
  }

  if (tmdbMovie.tagline !== undefined  && tmdbMovie.genres) {
    movie.tagline = tmdbMovie.tagline;
  }

  if (tmdbMovie.runtime !== undefined  && tmdbMovie.genres) {
    movie.runtime = tmdbMovie.runtime;
  }

  if (tmdbMovie.imdb_id !== undefined  && tmdbMovie.genres) {
    movie.imdb_id = tmdbMovie.imdb_id;
  }

  return movie;
}

module.exports = convertTmdbToMovie;
