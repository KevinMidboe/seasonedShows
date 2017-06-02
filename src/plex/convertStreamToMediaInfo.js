const MediaInfo = require('src/media_classes/mediaInfo');

function convertStreamToMediaInfo(plexStream) {
	const mediaInfo = new MediaInfo();
	
	mediaInfo.duration = plexStream.duration;
	mediaInfo.height = plexStream.height;
	mediaInfo.width = plexStream.width;
	if (plexStream.bitrate) {
		mediaInfo.bitrate = plexStream.bitrate;
	}
	mediaInfo.resolution = plexStream.videoResolution;
	mediaInfo.framerate = plexStream.videoFrameRate;
	mediaInfo.protocol = plexStream.protocol;
	mediaInfo.container = plexStream.container;
	mediaInfo.audioCodec = plexStream.audioCodec;

	return mediaInfo;
}

module.exports = convertStreamToMediaInfo;