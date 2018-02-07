const convertPlexToSeasoned = require('src/plex/convertPlexToSeasoned');
const convertStreamToMediaInfo = require('src/plex/convertStreamToMediaInfo');
const convertStreamToPlayer = require('src/plex/stream/convertStreamToPlayer');
const convertStreamToUser = require('src/plex/stream/convertStreamToUser');
const ConvertStreamToPlayback = require('src/plex/stream/convertStreamToPlayback');

function convertPlexToStream(plexStream) {
   const stream = convertPlexToSeasoned(plexStream);
   const plexStreamMedia = plexStream.Media[0];
   stream.mediaInfo = convertStreamToMediaInfo(plexStreamMedia);
   stream.player = convertStreamToPlayer(plexStream.Player);

   stream.user = convertStreamToUser(plexStream.User);
   stream.playback = new ConvertStreamToPlayback(plexStreamMedia.Part[0]);

   return stream;
}

module.exports = convertPlexToStream;
