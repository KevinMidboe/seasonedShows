import React from 'react';

import MovieObject from './MovieObject.jsx';

// TODO add option for searching multi, movies or tv shows

class SearchRequest extends React.Component {
	constructor(props){
    super(props)
    // Constructor with states holding the search query and the element of reponse.
    this.state = {
      searchQuery: '',
      responseMovieList: null
    }

    this.URLs = {
    	request: 'https://apollo.kevinmidboe.com/api/v1/plex/request?query=',
    	sendRequest: 'https://apollo.kevinmidboe.com/api/v1/plex/request?query='
    }
  }

  componentDidMount(){
  	var that = this;
  	this.setState({responseMovieList: null})
  }
  
  // Handles all errors of the response of a fetch call
  handleErrors(response) {
  	if (!response.ok) {
  		throw Error(response.status);
  	}
  	return response;
  }

  fetchQuery() {
    let url = this.URLs.request + this.state.searchQuery

      fetch(url)
      	// Check if the response is ok
      	.then(response => this.handleErrors(response))
      	.then(response => response.json()) // Convert to json object and pass to next then
	      .then(data => {  // Parse the data of the JSON response
	      	// If it is something here it updates the state variable with the HTML list of all 
	      	// movie objects that where returned by the search request
	      	if (data.length > 0) {
	        	this.setState({
	        		responseMovieList: data.map(item => this.createMovieObjects(item))
	        	})
	      	}
	      })
	      // If the --------
	      .catch(error => {
	      	console.log(error)
	      	this.setState({
	      		responseMovieList: <h1>Not Found</h1>
	      	})

	      	console.log('Error submit: ', error.toString());
	      });
  }

  // Updates the internal state of the query search field.
  updateQueryState(event){
    this.setState({
      searchQuery: event.target.value
    });
  }

  // For checking if the enter key was pressed in the search field.
  _handleQueryKeyPress(e) {
    if (e.key === 'Enter') {
      this.fetchQuery();
    }
  }

  // When called passes the variable to MovieObject and calls it's interal function for 
  // generating the wanted HTML
  createMovieObjects(item) {
    let movie = new MovieObject(item);
    return movie.getElement();
  }


  render(){
    return(
     <div>
        <input
          type="text"
          onKeyPress={(event) => this._handleQueryKeyPress(event)}
          onChange={event => this.updateQueryState(event)}
          value={this.state.searchQuery}
          />
          <button onClick={() => this.fetchQuery()}>Search</button>
          <br></br>

          <br></br>
          <div id='requestMovieList' ref='requestMovieList'>
            {this.state.responseMovieList}        
          </div>
      </div>
    )
  }

	
}

export default SearchRequest;