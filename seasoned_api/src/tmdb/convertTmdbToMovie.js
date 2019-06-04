const Movie = require('src/tmdb/types/movie');

const tmdbSwitcher = (tmdbMovie, property) => tmdbMovie[property]

function convertTmdbToMovie(tmdbMovie, credits=undefined) {
  const movie = new Movie(tmdbMovie.id, tmdbMovie.title)
  movie.overview = tmdbMovie.overview;
  movie.rank = tmdbMovie.vote_average;

  if (credits) {
    movie.credits = credits;
  }

  if (tmdbMovie.release_date !== undefined) {
    movie.release_date = new Date(tmdbMovie.release_date);
    movie.year = movie.release_date.getFullYear();
  }

  if (tmdbMovie.poster_path !== undefined) {
    movie.poster = tmdbMovie.poster_path;
  }
  if (tmdbMovie.backdrop_path !== undefined) {
    movie.backdrop = tmdbMovie.backdrop_path;
  }

  if (tmdbMovie.status !== undefined) {
    movie.status = tmdbMovie.status;
  }

  if (tmdbMovie.genres !== undefined) {
    movie.genres = tmdbMovie.genres.map(genre => genre.name);
  }

  if (tmdbMovie.tagline !== undefined) {
    movie.tagline = tmdbMovie.tagline;
  }

  if (tmdbMovie.runtime !== undefined) {
    movie.runtime = tmdbMovie.runtime;
  }

  if (tmdbMovie.imdb_id !== undefined) {
    movie.imdb_id = tmdbMovie.imdb_id;
  }

  return movie;
}

module.exports = convertTmdbToMovie;
