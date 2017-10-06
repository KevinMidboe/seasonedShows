import React from 'react';

import requestElement from './styles/requestElementStyle.jsx'

import { getCookie } from './Cookie.jsx';

class RequestElement extends React.Component {
	constructor(props) {
		super(props);
		this.default_requestList = null;
	}

	filterRequestList(requestList, filter) {
		if (filter === 'all')
			return requestList

		return requestList.filter(item => item.status === filter)
	}

	sortRequestList(requestList, sort_type, reversed) {
		requestList.sort(function(a,b) {
			if(a[sort_type] < b[sort_type]) return -1;
		  if(a[sort_type] > b[sort_type]) return 1;
		  return 0;
		});

		if (reversed)
			requestList.reverse();
	}

	createHTMLElement(data, index) {
		var posterPath = 'https://image.tmdb.org/t/p/w300' + data.image_path;
		
		if (data.user_agent !== null) {
			var user_agent = data.user_agent.split(" ");
			var agent_shortened = user_agent[1].replace(/[\(\;]/g, '')
		}

		return (
			<div style={requestElement.wrappingDiv} key={index}>
				<img style={requestElement.requestPoster} src={posterPath}></img>
				<div style={requestElement.infoDiv}>
					<span><b>Name</b>: {data.name} </span>
					<span><b>Year</b>: {data.year}</span><br></br>
					<span><b>Status</b>: {data.status}</span><br></br>
					<span><b>Address</b>: {data.ip}</span><br></br>
					<span><b>Requested Data:</b> {data.requested_date}</span><br></br>
					<span><b>Requested By:</b> {data.requested_by}</span><br></br>
					<span><b>Agent</b>: {agent_shortened}</span><br></br>
				</div>
			</div>
		)
	}

  render() {
    const {requestedElementsList, requestedElementsFilter, requestedElementsSort, props} = this.props;

    var filteredRequestedList = this.filterRequestList(requestedElementsList, requestedElementsFilter)

		this.sortRequestList(filteredRequestedList, requestedElementsSort.value, requestedElementsSort.reversed)

    return (
      <div {...props} style={requestElement.bodyDiv}>
        {filteredRequestedList.map((requestItem, index) => this.createHTMLElement(requestItem, index))}
      </div>
    );
  }
}


class FetchRequested extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			requested_objects: [],
			filter: 'all',
			sort: {
				value: 'requested_date',
				reversed: false
			},
		}
	}

	componentDidMount(){
		Promise.resolve()
		fetch('https://apollo.kevinmidboe.com/api/v1/plex/requests/all', {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			  'authorization': getCookie('token')
			}
		})
		.then(response =>  {
				if (response.status !== 200) {
					console.log('error');
				}

				response.json()
				.then(data => {
					if (data.success === true) {
						this.setState({
							requested_objects: data.requestedItems
						})
					}
				})
		})
		.catch(error => {
			new Error(error);
		})
	}

	changeFilter(filter) {
		this.setState({
			filter: filter
		})
	}

	updateSort(sort=null, reverse=false) {
		if (sort) {
			this.setState({
				sort: { value: sort, reversed: reverse }
			})
		} 
		else {
			this.setState({
				sort: { value: this.state.sort.value, reversed: reverse }
			})
		}
	}



	render(){
		return(
			<div>
				<select id="lang" onChange={event => this.changeFilter(event.target.value)} value={this.state.value}>
					<option value="all">All</option>
					<option value="requested">Requested</option>
					<option value="downloading">Downloading</option>
					<option value="downloaded">Downloaded</option>
				</select>

				<select id="lang" onChange={event => this.updateSort(event.target.value)} value={this.state.value}>
					<option value='requested_date'>Date</option>
					<option value='name'>Title</option>
					<option value='status'>Status</option>
					<option value='requested_by'>Requested By</option>
					<option value='ip'>Address</option>
					<option value='user_agent'>Agent</option>
				</select>

				<button onClick={() => {this.updateSort(null, !this.state.sort.reversed)}}>Reverse</button>
				
				<RequestElement
					requestedElementsList={this.state.requested_objects}
					requestedElementsFilter={this.state.filter}
					requestedElementsSort={this.state.sort}
				/>
				
			</div>
		)
	}
}

export default FetchRequested;