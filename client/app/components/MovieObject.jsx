import React from 'react';

class MovieObject {
	constructor(object) {
		this.id = object.id;
		this.title = object.title;
		this.year = object.year;
		// Check if object.poster != undefined
		this.poster = object.poster;
		this.matchedInPlex = object.matchedInPlex;
		this.overview = object.overview;
	}

	requestExisting(movie) {
		console.log('Exists', movie)
	}

	requestMovie(id) {
		fetch('http://localhost:31459/api/v1/plex/request/' + id, {
		  method: 'POST'
		})
	}

	getElement() {
		var returnList = []

		returnList.push(<p>{this.title} ({this.year})</p>)
		
		var posterPath, buttonState;
		if (this.poster != undefined) {
			posterPath = 'https://image.tmdb.org/t/p/w150' + this.poster;
		}
		returnList.push(<img src={posterPath}></img>);

		if (this.matchedInPlex) {
			returnList.push(<button onClick={() => this.requestExisting(this)}>Request anyway</button>)
		} else {
			returnList.push(<button onClick={() => this.requestMovie(this)}>Request</button>)
		}

		returnList.push(<span>{this.overview}</span>);

		returnList.push(<br></br>);
		return returnList;
	}
}

export default MovieObject;