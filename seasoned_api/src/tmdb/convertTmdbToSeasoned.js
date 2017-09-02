const Movie = require('src/media_classes/movie');
const Show = require('src/media_classes/show');

function convertTmdbToSeasoned(tmdbObject) {
	console.log(tmdbObject)

	const mediaType = tmdbObject.media_type;

	// There are many diff types of content, we only want to look at movies and tv shows
	if (mediaType === 'movie') {
		const year = new Date(tmdbObject.release_date).getFullYear();

		const movie = new Movie(tmdbObject.title, year, mediaType);

		movie.summary = tmdbObject.overview;
		movie.rating = tmdbObject.vote_average;
		movie.poster = tmdbObject.poster_path;
		movie.background = tmdbObject.backdrop_path;
		movie.genre = tmdbObject.genre_ids;

		return movie;
	} 
	else if (mediaType === 'tv') {
		const year = new Date(tmdbObject.first_air_date).getFullYear();

		const show = new Show(tmdbObject.title, year, mediaType);

		show.summary = tmdbObject.overview;
		show.rating = tmdbObject.vote_average;
		show.poster = tmdbObject.poster_path;
		show.background = tmdbObject.backdrop_path;
		show.genre = tmdbObject.genre_ids;

		return show;
	}
}

module.exports = convertTmdbToSeasoned;