const Movie = require('src/media_classes/movie');
const Show = require('src/media_classes/show');

function convertPlexToSeasoned(plexObject) {

	const mediaType = plexObject.type;
	// There are many diff types of content, we only want to look at movies and tv shows
	if (mediaType === 'movie') {
		const movie = new Movie(plexObject.title, plexObject.year, mediaType);

		movie.summary = plexObject.summary;
		movie.rating = plexObject.rating;
		movie.poster = plexObject.thumb;
		movie.background = plexObject.art;
		movie.genre = plexObject.genre;
		movie.added = new Date(plexObject.addedAt * 1000);

		movie.mediaInfo = plexObject.Media;

		return movie;
	} 
	else if (mediaType === 'show') {
		const show = new Show(plexObject.title, plexObject.year, mediaType);

		show.summary = plexObject.summary;
		show.rating = plexObject.rating;
		show.poster = plexObject.thumb;
		show.background = plexObject.art;
		show.genre = plexObject.genre;
		show.added = new Date(plexObject.addedAt * 1000);

		show.seasons = plexObject.childCount;
		show.episodes = plexObject.leafCount;

		return show;
	}
}

module.exports = convertPlexToSeasoned;