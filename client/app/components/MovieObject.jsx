import React from 'react';
import glamorous from 'glamorous';

// StyleComponents
import mediaResultItem from './styledComponents/mediaResultItem.jsx';

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
		fetch('https://apollo.kevinmidboe.com/api/v1/plex/request/' + id, {
		  method: 'POST'
		});
	}

	getElement() {
		// TODO move this to separate files.
		var resultItem = {
			maxWidth: '95%',
			margin: '0 auto',
			minHeight: '230px'
		}
		var movie_content = {
			marginLeft: '15px'
		}
		var resultTitle = {
			color: 'black',
			fontSize: '2em',
		}

		var resultPoster = {
			float: 'left',
			zIndex: '3',
			position: 'relative',
			marginRight: '30px'
		}

		var resultPosterImg = {
			border: '2px none',
		    borderRadius: '2px',
		    width: '150px'
		}

		var buttons = {
			paddingTop: '20px'
		}

		var requestButton = {
			color: '#e9a131',
			marginRight: '10px',
			background: 'white',
			border: '#e9a131 2px solid',
			borderRadius: '4px',
			textAlign: 'center',
			padding: '10px',
			minWidth: '100px',
			float: 'left',
			fontSize: '13px',
			fontWeight: '800',
			cursor: 'pointer'
		}

		var tmdbButton = {
			color: '#00d17c',
			marginRight: '10px',
			background: 'white',
			border: '#00d17c 2px solid',
			borderRadius: '4px',
			textAlign: 'center',
			padding: '10px',
			minWidth: '100px',
			float: 'left',
			fontSize: '13px',
			fontWeight: '800',
			cursor: 'pointer'
		}

		var row = {
			width: '100%'
		}

		var itemDivider = {
			width: '90%',
			borderBottom: '1px solid grey',
			margin: '2rem auto'
		}

		// TODO set the poster image async by updating the dom after this is returned
		if (this.poster == null || this.poster == undefined) {
			var posterPath = 'https://openclipart.org/image/2400px/svg_to_png/211479/Simple-Image-Not-Found-Icon.png'
		} else {
			var posterPath = 'https://image.tmdb.org/t/p/w154' + this.poster;
		}
		var foundInPlex;
		if (this.matchedInPlex) {
			foundInPlex = <button onClick={() => {this.requestExisting(this)}} 
			style={requestButton}><span>Request Anyway</span></button>;
		} else {
			foundInPlex = <button onClick={() => {this.requestMovie(this.id)}} 
			style={requestButton}><span>&#x0002B; Request</span></button>;
		}

		var themoviedbLink = 'https://www.themoviedb.org/movie/' + this.id
		

		return (
		<div>
			<div style={resultItem} key={this.id}>
				<div style={resultPoster}>
					<img style={resultPosterImg} id='poster' src={posterPath}></img>
				</div>
				<div>
					<span style={resultTitle}>{this.title} ({this.year})</span>
					<br></br>
						<span>{this.overview}</span>
					<br></br>

					<span className='imdbLogo'>
					</span>

					<div style={buttons}>
						{foundInPlex}
						<a href={themoviedbLink}><button style={tmdbButton}><span>Info</span></button></a>
					</div>
				</div>
			</div>
			<div style={row}>
				<div style={itemDivider}></div>
			</div>
		</div>)

	}
}

export default MovieObject;