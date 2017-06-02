import React from 'react';

class MovieObject {
	constructor(object) {
		this.id = object.id;
		this.title = object.title;
		this.year = object.year;
		// Check if object.poster != undefined
		this.poster = 'https://image.tmdb.org/t/p/w150' + object.poster;
	}

	getElement() {
		var returnString = [
			<p>{this.title} ({this.year})</p>,
			<img src={this.poster}></img>,
			<br></br>
		]
		return returnString;
	}
}

export default MovieObject;