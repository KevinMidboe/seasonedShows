class Movie {
	constructor(title, year, type) {
		this.id = undefined;
		this.title = title;
		this.year = year;
		this.type = type;
		this.release_date = undefined;
		this.summary = undefined;
		this.rating = undefined;
		this.poster = undefined;
		this.background = undefined;
		this.genre = undefined;
		
		this.mediaInfo = undefined;
		
		this.matchedInPlex = false;
	}
}

module.exports = Movie;