class convertStreamToPlayback {
	constructor(plexStream) {
		this.bitrate = plexStream.bitrate;
		this.width = plexStream.width;
		this.height = plexStream.height;
		this.decision = plexStream.decision;
		this.audioProfile = plexStream.audioProfile;
		this.videoProfile = plexStream.videoProfile;
		this.duration = plexStream.duration;
		this.container = plexStream.container;

	}
}

module.exports = convertStreamToPlayback;