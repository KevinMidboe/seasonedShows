import React from 'react';

// StyleComponents
import movieStyle from './styles/movieObjectStyle.jsx';

class MovieObject {
	constructor(object) {
		this.id = object.id;
		this.title = object.title;
		this.year = object.year;
		this.type = object.type;
		// Check if object.poster != undefined
		this.poster = object.poster;
		this.matchedInPlex = object.matchedInPlex;
		this.summary = object.summary;
	}

	requestExisting(movie) {
		console.log('Exists', movie);
	}

	requestMovie() {
		// fetch('https://apollo.kevinmidboe.com/api/v1/plex/request/' + id, {
		fetch('http://localhost:31459/api/v1/plex/request/' + this.id + '?type='+this.type, {
		  method: 'POST'
		});
	}

	getElement() {
		// TODO set the poster image async by updating the dom after this is returned
		if (this.poster == null || this.poster == undefined) {
			var posterPath = 'https://openclipart.org/image/2400px/svg_to_png/211479/Simple-Image-Not-Found-Icon.png'
		} else {
			var posterPath = 'https://image.tmdb.org/t/p/w154' + this.poster;
		}
		var foundInPlex;
		if (this.matchedInPlex) {
			foundInPlex = <button onClick={() => {this.requestExisting(this)}} 
			style={movieStyle.requestButton}><span>Request Anyway</span></button>;
		} else {
			foundInPlex = <button onClick={() => {this.requestMovie()}} 
			style={movieStyle.requestButton}><span>&#x0002B; Request</span></button>;
		}

		var themoviedbLink = 'https://www.themoviedb.org/movie/' + this.id
		

		return (
		<div>
			<div style={movieStyle.resultItem} key={this.id}>
				<div style={movieStyle.resultPoster}>
					<img style={movieStyle.resultPosterImg} id='poster' src={posterPath}></img>
				</div>
				<div>
					<span style={movieStyle.resultTitle}>{this.title} ({this.year})</span>
					<br></br>
						<span>{this.summary}</span>
					<br></br>

					<span className='imdbLogo'>
					</span>

					<div style={movieStyle.buttons}>
						{foundInPlex}
						<a href={themoviedbLink}>
							<button style={movieStyle.tmdbButton}><span>Info</span></button>
						</a>
					</div>
				</div>
			</div>
			<div style={movieStyle.row}>
				<div style={movieStyle.itemDivider}></div>
			</div>
		</div>)

	}
}

export default MovieObject;