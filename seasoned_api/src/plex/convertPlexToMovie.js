const Movie = require('src/media_classes/movie');

function convertPlexToMovie(plexMovie) {
	const movie = new Movie();
	movie.title = plexMovie.title;
	
	if (plexMovie.type === 'episode') {
		movie.title = plexMovie.grandparentTitle;
		movie.childTitle = plexMovie.title;
		movie.season = plexMovie.parentIndex;
		movie.episode = plexMovie.index;
	}
	movie.year = plexMovie.year;
	movie.library = plexMovie.librarySectionTitle;
	movie.type = plexMovie.type;
	movie.poster = plexMovie.thumb;
	movie.background = plexMovie.art;

	return movie;
}

module.exports = convertPlexToMovie;