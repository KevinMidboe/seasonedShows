const Movie = require('src/media_classes/movie');

function convertTmdbToMovie(tmdbMovie) {
	const movie = new Movie();
	movie.id = tmdbMovie.id;
	if (tmdbMovie.media_type === 'movie' || tmdbMovie.release_date !== undefined) {
		movie.title = tmdbMovie.title;
		movie.type = 'movie';

		if (tmdbMovie.release_date !== undefined) {
			movie.release_date = new Date(tmdbMovie.release_date);
			movie.year = movie.release_date.getFullYear();
		}
	} else if (tmdbMovie.first_air_date !== undefined) {
		movie.title = tmdbMovie.name;
		movie.type = 'show';
		if (tmdbMovie.first_air_date !== undefined) {
			movie.release_date = new Date(tmdbMovie.first_air_date);
			movie.year = movie.release_date.getFullYear();
		}
	}

	movie.poster = tmdbMovie.poster_path;
	movie.background = tmdbMovie.backdrop_path;
	movie.overview = tmdbMovie.overview;

	return movie;
}

module.exports = convertTmdbToMovie;