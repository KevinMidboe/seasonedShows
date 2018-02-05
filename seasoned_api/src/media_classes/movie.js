class Movie {
	constructor(title, year, type) {
		this.id = undefined;
		this.title = title;
		this.year = year;
		this.type = type;
		this.release_date = undefined;
		this.summary = undefined;
		this.rating = undefined;
		this.poster_path = undefined;
		this.background = undefined;
		this.genre = undefined;
		this.date_added = undefined;
		
		this.mediaInfo = undefined;
		
		this.matchedInPlex = false;
	}
}

module.exports = Movie;
