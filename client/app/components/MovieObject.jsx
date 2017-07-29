import React from 'react';

import '../app.css';

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
		console.log('Exists', movie);
	}

	requestMovie(id) {
		fetch('http://localhost:31459/api/v1/plex/request/' + id, {
		  method: 'POST'
		});
	}

	getElement() {
		var posterPath = 'https://image.tmdb.org/t/p/w154' + this.poster;
		var buttonState;
		if (this.matchedInPlex) {
			buttonState = <button onClick={() => {this.requestExisting(this)}}>Request anyway</button>;
		} else {
			buttonState = <button onClick={() => {this.requestMovie(this.id)}}>Request</button>;
		}

		return (
		<div key={this.id} className='movie_wrapper'>
			<img src={posterPath}></img>
			<div className='movie_content'>
				<span className='movie_header'>{this.title} ({this.year})</span>
				<br></br>
				{buttonState}
				<br></br>
				<span>{this.overview}</span>
			</div>
		</div>)
	}
}

export default MovieObject;