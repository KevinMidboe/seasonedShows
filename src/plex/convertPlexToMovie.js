const Movie = require('src/movie/movie');

function converPlexToMovie(plexMovie) {
	const movie = new Movie();
	movie.title = plexMovie.title;
	movie.year = plexMovie.year;
	movie.library = plexMovie.librarySectionTitle;
	movie.type = plexMovie.type;

	return movie;
}

module.exports = converPlexToMovie;