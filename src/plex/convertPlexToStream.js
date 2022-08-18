const convertPlexToSeasoned = require("./convertPlexToSeasoned");
const convertStreamToMediaInfo = require("./convertStreamToMediaInfo");
const convertStreamToPlayer = require("./stream/convertStreamToPlayer");
const convertStreamToUser = require("./stream/convertStreamToUser");
const ConvertStreamToPlayback = require("./stream/convertStreamToPlayback");

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
