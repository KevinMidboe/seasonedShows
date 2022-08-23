import Movie from "./types/movie.js";

function convertPlexToMovie(plexMovie) {
  const movie = new Movie(plexMovie.title, plexMovie.year);
  movie.rating = plexMovie.rating;
  movie.tagline = plexMovie.tagline;

  if (plexMovie.summary !== undefined) {
    movie.summary = plexMovie.summary;
  }

  return movie;
}

export default convertPlexToMovie;
