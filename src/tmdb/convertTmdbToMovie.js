const Movie = require('src/movie/movie');

function convertTmdbToMovie(tmdbMovie) {
	const movie = new Movie();
	movie.title = tmdbMovie.title;
	movie.type = 'movie';

	if (tmdbMovie.release_date !== undefined) {
		movie.release_date = new Date(tmdbMovie.release_date);
		movie.year = movie.release_date.getFullYear();
	}

	return movie;
}

module.exports = convertTmdbToMovie;