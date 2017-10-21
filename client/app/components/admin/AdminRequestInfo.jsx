import React, { Component } from 'react';
import PirateSearch from './PirateSearch.jsx'

class AdminRequestInfo extends Component {

  constructor() {
    super();
  }

	userAgent(agent) {
		if (agent) {
			try {
				return agent.split(" ")[1].replace(/[\(\;]/g, '');
			}
			catch(e) {
				return agent;
			}
		}
		return '';
	}

  displayInfo() {
  	let adminIndexStyle = {
	  	wrapper: {
	  		width: '100%',
	  	},
	  	headerWrapper: {
	  		width: '100%',
	  	},
	  	poster: {
	  		float: 'left',
        	minHeight: '450px',
	  	},
	  	info: {
	  		float: 'left',
	  		minHeight: '450px',
	  	}
  	}
  	const request = this.props.selectedRequest;

  	if (request) {
  		return (
  			<div style={adminIndexStyle.wrapper}>
  				<div style={adminIndexStyle.headerWrapper}>
  					<span>{request.name} </span>
  					<span>{request.year}</span>
  				</div>
  				<div style={adminIndexStyle.poster}>
  					<img src={'https://image.tmdb.org/t/p/w300/' + request.image_path} />
  				</div>
  				<div style={adminIndexStyle.info}>
  					<span>type: {request.type}</span><br />
  					<span>status: {request.status}</span><br />
  					<span>ip: {request.ip}</span><br />
  					<span>user_agent: {this.userAgent(request.user_agent)}</span><br />
  					<span>request_date: {request.requested_date}</span><br />
  				</div>
  				
  				<PirateSearch
  					name={request.name} />
  			
  			</div>
  		)
  	}
  }

  render() {
    return (
    	<div>{this.displayInfo()}</div>
    );
  }
}

export default AdminRequestInfo;