import React from 'react';

class FetchData extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			imgUrls: [],
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
					console.log(data.size);
					that.setState({
						imgUrls: that.state.imgUrls.concat(data.video)
					})
					console.log(data.video.title);
				})
			}
		)
	}

	componentWillUnmount() {
	   // use intervalId from the state to clear the interval
	   clearInterval(this.state.intervalId);
	}

	getPlaying() {
		console.log('Should not reach')
		// Need callback to work
		// Should try to clear out old requests to limit mem use
	}

	render(){
			return(
			<div className="FetchData">
			{this.state.imgUrls.map((imgObj) => {
				return ([
					<span>{imgObj.title}</span>,
					<span>{imgObj.season}</span>,
					<span>{imgObj.episode}</span>,
				]);
			})}

			</div>
		);
	}

	
}

export default FetchData;