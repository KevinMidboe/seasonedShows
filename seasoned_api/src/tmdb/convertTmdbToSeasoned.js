const Movie = require('src/media_classes/movie');
const Show = require('src/media_classes/show');

function convertTmdbToSeasoned(tmdbObject, strictType=undefined) {
	if (strictType === undefined)
		var mediaType = tmdbObject.media_type;
	else
		var mediaType = strictType;	

	// There are many diff types of content, we only want to look at movies and tv shows
	if (mediaType === 'movie') {
		const year = new Date(tmdbObject.release_date).getFullYear();

		if (tmdbObject.title !== undefined) {
			var title = tmdbObject.title;
		} else if (tmdbObject.name !== undefined) {
			var title = tmdbObject.name;
		}

		const movie = new Movie(title, year, mediaType);

		movie.id = tmdbObject.id;
		movie.summary = tmdbObject.overview;
		movie.rating = tmdbObject.vote_average;
		movie.poster = tmdbObject.poster_path;
		movie.background = tmdbObject.backdrop_path;
		movie.genre = tmdbObject.genre_ids;

		movie.popularity = tmdbObject.popularity;
		movie.vote_count = tmdbObject.vote_count;

		return movie;
	} 
	else if (mediaType === 'tv' || mediaType === 'show') {
		const year = new Date(tmdbObject.first_air_date).getFullYear();

		const show = new Show(tmdbObject.name, year, 'show');

		show.id = tmdbObject.id;
		show.summary = tmdbObject.overview;
		show.rating = tmdbObject.vote_average;
		show.poster = tmdbObject.poster_path;
		show.background = tmdbObject.backdrop_path;
		show.genre = tmdbObject.genre_ids;

		show.popularity = tmdbObject.popularity;
		show.vote_count = tmdbObject.vote_count;

		return show;
	}
}

module.exports = convertTmdbToSeasoned;

