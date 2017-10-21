import React, { Component } from 'react';
import { fetchJSON } from '../http.jsx'; 

class PirateSearch extends Component {
	constructor() {
		super();
		this.state = {
			response: [],
			name: '',
		}
	}

	sendToDownload(torrent) {
		console.log(torrent.magnet)

		let data = {magnet: torrent.magnet}
		fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/add', 'POST', data)
		.then((response) => {
			console.log(response)
		})
	}

	searchTheBay() {
		const query = this.props.name;
		const type = this.props.type;

		fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/search?query='+query+'&type='+type, 'GET')
		.then((response) => {
			console.log(response.torrents)
			this.setState({
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
				<span>{this.props.name}</span>
				<button onClick={() => {this.searchTheBay(this)}}>Load shit</button>
				<span>{this.state.response}</span>
			</div>
		)
	}
}

export default PirateSearch