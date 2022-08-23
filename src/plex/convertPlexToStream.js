import convertPlexToSeasoned from "./convertPlexToSeasoned.js";
import convertStreamToMediaInfo from "./convertStreamToMediaInfo.js";
import convertStreamToPlayer from "./stream/convertStreamToPlayer.js";
import convertStreamToUser from "./stream/convertStreamToUser.js";
import ConvertStreamToPlayback from "./stream/convertStreamToPlayback.js";

function convertPlexToStream(plexStream) {
  const stream = convertPlexToSeasoned(plexStream);
  const plexStreamMedia = plexStream.Media[0];
  stream.mediaInfo = convertStreamToMediaInfo(plexStreamMedia);
  stream.player = convertStreamToPlayer(plexStream.Player);

  stream.user = convertStreamToUser(plexStream.User);
  stream.playback = new ConvertStreamToPlayback(plexStreamMedia.Part[0]);

  return stream;
}

export default convertPlexToStream;
