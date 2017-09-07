const convertPlexToSeasoned = require('src/plex/convertPlexToSeasoned');
const convertStreamToMediaInfo = require('src/plex/convertStreamToMediaInfo');
const convertStreamToPlayer = require('src/plex/stream/convertStreamToPlayer');
const convertStreamToUser = require('src/plex/stream/convertStreamToUser');
const ConvertStreamToPlayback = require('src/plex/stream/convertStreamToPlayback');

function convertPlexToStream(plexStream) {
	const stream = convertPlexToSeasoned(plexStream);
	stream.mediaInfo = convertStreamToMediaInfo(plexStream.Media);
	stream.player = convertStreamToPlayer(plexStream.Player);
	stream.user = convertStreamToUser(plexStream.User);
	stream.playback = new ConvertStreamToPlayback(plexStream.Media.Part);

	return stream;
}

module.exports = convertPlexToStream;