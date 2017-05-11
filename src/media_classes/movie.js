class Movie {
	constructor(title, year) {
		this.id = undefined;
		this.title = title;
		this.year = year;
		this.release_date = undefined;
		this.library = undefined;
		this.type = undefined;
		this.poster = undefined;
		this.background = undefined;
		this.matchedInPlex = false;
		this.childTitle = undefined;
		this.season = undefined;
		this.episode = undefined;
	}
}

module.exports = Movie;