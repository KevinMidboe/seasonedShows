import React, { Component } from 'react';

import { fetchJSON } from '../http.jsx'; 

import PirateSearch from './PirateSearch.jsx'

// Stylesheets
import requestInfoCSS from '../styles/adminRequestInfo.jsx'
import buttonsCSS from '../styles/buttons.jsx';

// Interactive button
import Interactive from 'react-interactive';

class AdminRequestInfo extends Component {

  constructor() {
    super();

    this.state = {
      statusValue: '',
    }

    this.requestInfo = '';
  }

  componentWillReceiveProps(props) {
    this.requestInfo = props.selectedRequest;
    this.state.statusValue = this.requestInfo.status;
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

  generateStatusDropdown() {
    return (
      <select onChange={ event => this.updateRequestStatus(event) } value={this.state.statusValue}>
        <option value='requested'>Requested</option>
        <option value='downloading'>Downloading</option>
        <option value='downloaded'>Downloaded</option>
      </select> 
    )
  }

  updateRequestStatus(event) {
    const eventValue = event.target.value;
    const itemID = this.requestInfo.id;

    const apiData = {
        type: this.requestInfo.type,
        status: eventValue,
    }

    fetchJSON('https://apollo.kevinmidboe.com/api/v1/plex/request/' + itemID, 'PUT', apiData)
    .then((response) => {
      console.log('Response, updateRequestStatus: ', response)
    })

    this.setState({
      statusValue: eventValue
    })
  }

	requested_by_user(request_user) {
		if (request_user === 'NULL')
			return undefined

		return (
			<span>Requested by: {request_user}</span>
		)
	}

   displayInfo() {
      const request = this.props.selectedRequest;

      if (request) {
      	return (
         <div style={requestInfoCSS.wrapper}>
            <div style={requestInfoCSS.headerWrapper}>
               <span>{request.name} </span>
               <span>{request.year}</span>
            </div>

            <div style={requestInfoCSS.info}>
               <span>type: {request.type}</span><br />
               
               {this.generateStatusDropdown()}<br />
               
               <span>status: {request.status}</span><br />
               <span>ip: {request.ip}</span><br />
               <span>user_agent: {this.userAgent(request.user_agent)}</span><br />
               <span>request_date: {request.requested_date}</span><br />
               { this.requested_by_user(request.requested_by) }
            </div>

            <div>
               <Interactive 
                  as='button'
                  onClick={() => {}}
                  style={buttonsCSS.edit}
                  focus={buttonsCSS.edit_hover}
                  hover={buttonsCSS.edit_hover}>

                 <span>Show info</span>
               </Interactive>

               <PirateSearch name={request.name} />
            </div>
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