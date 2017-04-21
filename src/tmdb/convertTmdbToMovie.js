const Movie = require('src/movie/movie');

function convertTmdbToMovie(tmdbMovie) {
	const movie = new Movie();
	if (tmdbMovie.media_type === 'movie') {
		movie.title = tmdbMovie.title;
		movie.type = tmdbMovie.media_type;

		if (tmdbMovie.release_date !== undefined) {
			movie.release_date = new Date(tmdbMovie.release_date);
			movie.year = movie.release_date.getFullYear();
		}
	} else if (tmdbMovie.media_type === 'tv') {
		movie.title = tmdbMovie.name;
		movie.type = 'show';
		if (tmdbMovie.first_air_date !== undefined) {
			movie.release_date = new Date(tmdbMovie.first_air_date);
			movie.year = movie.release_date.getFullYear();
		}
	}

	movie.poster = tmdbMovie.poster_path;
	movie.background = tmdbMovie.backdrop_path;

	return movie;
}

module.exports = convertTmdbToMovie;