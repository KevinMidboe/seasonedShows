import React from 'react';

require('../app.scss');

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
		var movie_wrapper = {
			display: 'flex',
			alignContent: 'center',
			width: '30%',
			backgroundColor: '#ffffff',
			height: '231px',
			margin: '20px',
			boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.15)'
		}
		var movie_content = {
			marginLeft: '15px'
		}
		var movie_header = {
			fontSize: '1.6' + 'em'
		}


		var posterPath = 'https://image.tmdb.org/t/p/w154' + this.poster;
		var buttonState;
		if (this.matchedInPlex) {
			buttonState = <button onClick={() => {this.requestExisting(this)}}>Request anyway</button>;
		} else {
			buttonState = <button onClick={() => {this.requestMovie(this.id)}}>Request</button>;
		}

		return (
		<div key={this.id} style={movie_wrapper}>
			<img src={posterPath}></img>
			<div style={movie_content}>
				<span style={movie_header}>{this.title} ({this.year})</span>
				<br></br>
				{buttonState}
				<br></br>
				<span>{this.overview}</span>
			</div>
		</div>)
	}
}

export default MovieObject;