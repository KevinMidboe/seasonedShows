import React from 'react';

import Notifications, {notify} from 'react-notify-toast';

// StyleComponents
import movieStyle from './styles/movieObjectStyle.jsx';

var MediaQuery = require('react-responsive');

import RequestButton from './buttons/request_button.jsx';

import { fetchJSON } from './http.jsx';

import Interactive from 'react-interactive';


class MovieObject {
	constructor(object) {
		this.id = object.id;
		this.title = object.title;
		this.year = object.year;
		this.type = object.type;
		// Check if object.poster != undefined
		this.rating = object.rating;
		this.poster = object.poster;
		this.background = object.background;
		this.matchedInPlex = object.matchedInPlex;
		this.summary = object.summary;
	}

	requestExisting(movie) {
		console.log('Exists', movie);
	}

	requestMovie() {
		// fetch('http://localhost:31459/api/v1/plex/request/' + this.id + '?type='+this.type, {
		// fetch('https://apollo.kevinmidboe.com/api/v1/plex/request/' + this.id + '?type='+this.type, {
		//   method: 'POST'
		// });
		fetchJSON('https://apollo.kevinmidboe.com/api/v1/plex/request/' + this.id + '?type='+this.type, 'POST')
		.then((response) => {
			console.log(response);
		})

		notify.show(this.title + ' requested!', 'success', 3000);
	}

	invertButtonColors(event) {
		const event_type = event.type;
		if (event_type)
			console.log('test')
		console.log(event.type)
	}

	getElement(index) {
		const element_key = index + this.id;

		// TODO set the poster image async by updating the dom after this is returned
		if (this.poster == null || this.poster == undefined) {
			var posterPath = 'https://openclipart.org/image/2400px/svg_to_png/211479/Simple-Image-Not-Found-Icon.png'
		} else {
			var posterPath = 'https://image.tmdb.org/t/p/w300' + this.poster;
		}
		var backgroundPath = 'https://image.tmdb.org/t/p/w640_and_h360_bestv2/' + this.background;

		var foundInPlex;
		if (this.matchedInPlex) {
			foundInPlex = <Interactive 
				as='button'
				hover={movieStyle.requestButton_hover}
				focus={movieStyle.requestButton_hover}
				onClick={() => {this.requestExisting(this)}} 
				style={movieStyle.requestButton}>
					
				<span>Request Anyway</span>
			</Interactive>;
		} else {
			foundInPlex = <Interactive 
				as='button'
				hover={movieStyle.requestButton_hover}
				focus={movieStyle.requestButton_hover}
				onClick={() => {this.requestMovie()}} 
				onMouseOver={() => {this.invertButtonColors(event)}}
				style={movieStyle.requestButton}>

				<span>&#x0002B; Request</span>
			</Interactive>;
		}

		if (this.type === 'movie') 
			var themoviedbLink = 'https://www.themoviedb.org/movie/' + this.id
		else if (this.type === 'show')	
			var themoviedbLink = 'https://www.themoviedb.org/tv/' + this.id

		

		// TODO add request button class
		return (
		<div key={element_key}>
		 	<Notifications />
			<div style={movieStyle.resultItem} key={this.id}>
				<MediaQuery minWidth={600}>
				<div style={movieStyle.resultPoster}>
					<img style={movieStyle.resultPosterImg} id='poster' src={posterPath}></img>
				</div>
				</MediaQuery>
				<div>
					<MediaQuery minWidth={600}>
						<span style={movieStyle.resultTitleLarge}>{this.title}</span>
						<br></br>
						<span style={movieStyle.yearRatingLarge}>Released: { this.year } | Rating: {this.rating}</span>
						<br></br>
						<span style={movieStyle.summary}>{this.summary}</span>
						<br></br>
					</MediaQuery>


					<MediaQuery maxWidth={600}>
						<img src={ backgroundPath } style={movieStyle.background}></img>
						<span style={movieStyle.resultTitleSmall}>{this.title}</span>
						<br></br>
						<span style={movieStyle.yearRatingSmall}>Released: {this.year} | Rating: {this.rating}</span>
					</MediaQuery>


					<span className='imdbLogo'>				

					</span>

					<div style={movieStyle.buttons}>
						{foundInPlex}
						<a href={themoviedbLink}>
							<Interactive 
								as='button'
								hover={movieStyle.tmdbButton_hover}
								focus={movieStyle.tmdbButton_hover}
								style={movieStyle.tmdbButton}>

								<span>Info</span>
							</Interactive>
						</a>
					</div>
				</div>
			</div>
			<MediaQuery maxWidth={600}>
				<br></br>
			</MediaQuery>
			<div style={movieStyle.row}>
				<div style={movieStyle.itemDivider}></div>
			</div>
		</div>)

	}
}

export default MovieObject;