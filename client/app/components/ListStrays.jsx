import React from 'react';

class ListStrays extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			strays: [],
      		hei: '1'
		}
	}

	componentDidMount(){
		var that = this;
		fetch('https://apollo.kevinmidboe.com/api/v1/seasoned/all').then(
			function(response){
				response.json().then(function(data){
					// console.log(data);
					that.setState({
						strays: that.state.strays.concat(data)
					})
				})
			}
		)
	}

	render(){
		return(
			<div className="ListStrays">
				{this.state.strays.map((strayObj) => {
					if (strayObj.verified == 0) {
						var url = "https://kevinmidboe.com/seasoned/verified.html?id=" + strayObj.id;
						console.log(url);
						return ([
							<span key={strayObj.id}>{strayObj.name}</span>,
							<a href={url}>{strayObj.id}</a>
						])
					}
				})}

			</div>
		)
	}
}

export default ListStrays;