const Movie = require('src/plex/types/movie');

function convertPlexToMovie(plexMovie) {
  const movie = new Movie(plexMovie.title, plexMovie.year);
  movie.rating = plexMovie.rating;
  movie.tagline = plexMovie.tagline;
  
  if (plexMovie.summary !== undefined) {
    movie.summary = plexMovie.summary;
  }

  return movie;
}

module.exports = convertPlexToMovie;
