import React from 'react';

class FetchData extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			playing: [],
      		hei: '1',
      		intervalId: null,
      		url: ''
		}
	}

	componentDidMount(){
		var that = this;
		fetch("https://apollo.kevinmidboe.com/api/v1/plex/playing").then(
			function(response){
				response.json().then(function(data){
					that.setState({
						playing: that.state.playing.concat(data.video)
					})
				})
			}
		)
	}

	componentWillUnmount() {
	   // use intervalId from the state to clear the interval
	   clearInterval(this.state.intervalId);
	}

	getPlaying() {
		if (this.state.playing.length != 0) {
			return this.state.playing.map((playingObj) => {
				if (playingObj.type === 'episode') {
					console.log('episode')
					return ([
						<span>{playingObj.title}</span>,
						<span>{playingObj.season}</span>,
						<span>{playingObj.episode}</span>
					])
				} else if (playingObj.type === 'movie') {
					console.log('movie')
					return ([
						<span>{playingObj.title}</span>
					])
				}
			})
		} else {
			return (<span>Nothing playing</span>)
		}
	}

	render(){
			return(
			<div className="FetchData">{this.getPlaying()}</div>
		);
	}

	
}

export default FetchData;