class convertStreamToPlayback {
	constructor(plexStream) {
		this.bitrate = plexStream.bitrate;
		this.width = plexStream.width;
		this.height = plexStream.height;
		this.decision = plexStream.decision;
	}
}

module.exports = convertStreamToPlayback;