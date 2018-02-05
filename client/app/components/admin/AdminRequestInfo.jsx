import React, { Component } from 'react';

import { fetchJSON } from '../http.jsx'; 

import PirateSearch from './PirateSearch.jsx'
// No in use!
import InfoButton from '../buttons/InfoButton.jsx';

// Stylesheets
import requestInfoCSS from '../styles/adminRequestInfo.jsx'
import buttonsCSS from '../styles/buttons.jsx';


String.prototype.capitalize = function() {
   return this.charAt(0).toUpperCase() + this.slice(1);
}


class AdminRequestInfo extends Component {

  constructor() {
    super();

    this.state = {
      statusValue: '',
      movieInfo: undefined,
      expandedSummary: false,
    }

    this.requestInfo = '';
  }

  componentWillReceiveProps(props) {
    this.requestInfo = props.selectedRequest;
    this.state.statusValue = this.requestInfo.status;
    this.state.expandedSummary = false;
    this.fetchIteminfo()
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
      this.props.updateHandler()
    })
  }

   generateStatusIndicator(status) {
      switch (status) {
         case 'requested':
            // Yellow
            return 'linear-gradient(to right, rgb(63, 195, 243) 0, rgb(63, 195, 243) 10px, #fff 4px, #fff 100%) no-repeat'
         case 'downloading':
            // Blue
            return 'linear-gradient(to right, rgb(255, 225, 77) 0, rgb(255, 225, 77) 10px, #fff 4px, #fff 100%) no-repeat'
         case 'downloaded':
            // Green
            return 'linear-gradient(to right, #39aa56 0, #39aa56 10px, #fff 4px, #fff 100%) no-repeat'
         default:
            return 'linear-gradient(to right, grey 0, grey 10px, #fff 4px, #fff 100%) no-repeat'
      }
   }

   generateTypeIcon(type) {
      if (type === 'show')
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
         )
      else if (type === 'movie')
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
         )
      else
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
         )
   }

   toggleSummmaryLength() {
      this.setState({
         expandedSummary: !this.state.expandedSummary
      })
   }

   generateSummary() {
      // { this.state.movieInfo != undefined ? this.state.movieInfo.summary : 'Loading...' }
      const info = this.state.movieInfo;
      if (info !== undefined) {
         const summary = this.state.movieInfo.summary
         const summary_short = summary.slice(0, 180);
         
         return (
            <div>
               <span><b>Matched: </b> {String(info.matchedInPlex)}</span> <br/>
               <span><b>Rating: </b> {info.rating}</span> <br/>
               <span><b>Popularity: </b> {info.popularity}</span> <br/>
               {
                  (summary.length > 180 && this.state.expandedSummary === false) ?
                     <span><b>Summary: </b> { summary_short }<span onClick = {() => this.toggleSummmaryLength()}>... <span style={{color: 'blue', cursor: 'pointer'}}>Show more</span></span></span>
                  :
                     <span><b>Summary: </b> { summary }<span onClick = {() => this.toggleSummmaryLength()}><span style={{color: 'blue', cursor: 'pointer'}}> Show less</span></span></span>

               }
            </div>
         )
      } else {
         return <span>Loading...</span>
      }
   }

	requested_by_user(request_user) {
		if (request_user === 'NULL')
			return undefined

		return (
			<span><b>Requested by:</b> {request_user}</span>
		)
	}

   fetchIteminfo() {
      const itemID = this.requestInfo.id;
      const type = this.requestInfo.type;

      fetchJSON('https://apollo.kevinmidboe.com/api/v1/tmdb/' + itemID +'&type='+type, 'GET')
      .then((response) => {
         console.log('Response, getInfo:', response)
         this.setState({
            movieInfo: response
         });
         console.log(this.state.movieInfo)
      })
   }

   displayInfo() {
      const request = this.props.selectedRequest;

      if (request) {
         requestInfoCSS.info.background = this.generateStatusIndicator(request.status);

         return (
            <div style={requestInfoCSS.wrapper}>
               
               <div style={requestInfoCSS.stick}>
                  <span style={requestInfoCSS.title}> {request.title}  {request.year}</span>
                  <span style={{marginLeft: '2em'}}>
                     <span style={requestInfoCSS.type_icon}>{this.generateTypeIcon(request.type)}</span>
                     {/*<span style={style.type_text}>{request.type.capitalize()}</span> <br />*/}
                  </span>
               </div>
              
               <div style={requestInfoCSS.info}>
                  <div style={requestInfoCSS.info_poster}>
                     <img src={'https://image.tmdb.org/t/p/w185' + request.poster_path} style={requestInfoCSS.image} alt='Movie poster image'></img>
                  </div>

                  <div style={requestInfoCSS.info_request}>
                     <h3 style={requestInfoCSS.info_request_header}>Request info</h3>
                     
                     <span><b>status:</b>{ request.status }</span><br />
                     <span><b>ip:</b>{ request.ip }</span><br />
                     <span><b>user_agent:</b>{ this.userAgent(request.user_agent) }</span><br />
                     <span><b>request_date:</b>{ request.requested_date}</span><br />
                     { this.requested_by_user(request.requested_by) }<br />
                     { this.generateStatusDropdown() }<br />
                  </div>

                  <div style={requestInfoCSS.info_movie}>
                     <h3 style={requestInfoCSS.info_movie_header}>Movie info</h3>
                     
                     { this.generateSummary() }
                  </div>
               </div>

              <PirateSearch style={requestInfoCSS.search} name={request.title} />

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