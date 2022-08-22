import convertPlexToSeasoned from "./convertPlexToSeasoned";
import convertStreamToMediaInfo from "./convertStreamToMediaInfo";
import convertStreamToPlayer from "./stream/convertStreamToPlayer";
import convertStreamToUser from "./stream/convertStreamToUser";
import ConvertStreamToPlayback from "./stream/convertStreamToPlayback";

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
