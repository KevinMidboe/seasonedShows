import { Movie } from './types'

const tmdbSwitcher = (tmdbMovie, property) => tmdbMovie[property]

const releaseTypeEnum = {
  1: 'Premier',
  2: 'Limited theatrical',
  3: 'Theatrical',
  4: 'Digital',
  5: 'Physical',
  6: 'TV'
}

function convertTmdbToMovie(tmdbMovie, credits=undefined, releaseDates=undefined) {
  const movie = new Movie(tmdbMovie.id, tmdbMovie.title)
  movie.overview = tmdbMovie.overview;
  movie.rank = tmdbMovie.vote_average;

  if (credits) {
    movie.credits = { cast: credits.cast, crew: credits.crew };
  }

  if (releaseDates) {
    movie.release_dates = releaseDates.results.map((releasePlace) => {
      const newestRelease = releasePlace.release_dates.sort((a,b) => a.type < b.type ? 1 : -1)[0]
      const type = releaseTypeEnum[newestRelease.type]

      return {
        country: releasePlace.iso_3166_1,
        type: type,
        date: newestRelease.release_date
      }
    })
  }

  if (tmdbMovie.release_date !== undefined  && tmdbMovie.release_date) {
    movie.release_date = new Date(tmdbMovie.release_date);
    movie.year = movie.release_date.getFullYear();
  }

  if (tmdbMovie.poster_path !== undefined  && tmdbMovie.poster_path) {
    movie.poster = tmdbMovie.poster_path;
  }
  if (tmdbMovie.backdrop_path !== undefined  && tmdbMovie.backdrop_path) {
    movie.backdrop = tmdbMovie.backdrop_path;
  }

  if (tmdbMovie.status !== undefined  && tmdbMovie.status) {
    movie.status = tmdbMovie.status;
  }

  if (tmdbMovie.genres !== undefined  && tmdbMovie.genres) {
    movie.genres = tmdbMovie.genres.map(genre => genre.name);
  }

  if (tmdbMovie.tagline !== undefined  && tmdbMovie.tagline) {
    movie.tagline = tmdbMovie.tagline;
  }

  if (tmdbMovie.runtime !== undefined  && tmdbMovie.runtime) {
    movie.runtime = tmdbMovie.runtime;
  }

  if (tmdbMovie.imdb_id !== undefined  && tmdbMovie.imdb_id) {
    movie.imdb_id = tmdbMovie.imdb_id;
  }

  return movie;
}

module.exports = convertTmdbToMovie;
