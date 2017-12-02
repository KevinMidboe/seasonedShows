import React, { Component } from 'react';
import { fetchJSON } from '../http.jsx'; 

// Stylesheets
import btnStylesheet from '../styles/buttons.jsx';

// Interactive button
import Interactive from 'react-interactive';

import Loading from '../images/loading.jsx'

class PirateSearch extends Component {
	constructor() {
		super();
		this.state = {
			response: [],
			name: '',
			loading: '',
		}
	}

	sendToDownload(torrent) {
		let data = {magnet: torrent.magnet}
		fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/add', 'POST', data)
		.then((response) => {
			console.log(response)
		})
	}

	searchTheBay() {
		const query = this.props.name;
		const type = this.props.type;

		this.setState({
			loading: <Loading />
		})

		fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/search?query='+query+'&type='+type, 'GET')
		.then((response) => {
			console.log(response.torrents)
			this.setState({
				loading: '',
				response: response.torrents.map((torrent, index) => {
					return (
						<div key={index}>
							<span>{torrent.name}</span><br />
							<span>{torrent.size}</span><br />
							<span>{torrent.seed}</span><br />
							<button onClick={() => {this.sendToDownload(torrent)}}>Send to download</button>
							<br /><br />
						</div>
					)
				})
			})
		})
	}

	render() {
		return (
			<div>
				<div>
				<Interactive 
					as='button'
					onClick={() => {this.searchTheBay()}}
					style={btnStylesheet.submit}
					focus={btnStylesheet.submit_hover}
					hover={btnStylesheet.submit_hover}>
					
					<span style={{whiteSpace: 'nowrap'}}>Search for torrents</span>
				</Interactive>
				</div>

				{ this.state.loading }
				
				<span>{this.state.response}</span>
			</div>
		)
	}
}

export default PirateSearch