import React from 'react';

import MovieObject from './MovieObject.jsx';

class SearchRequest extends React.Component {
	constructor(props){
    super(props)
    this.state = {
      searchQuery: '',
      items: []
    }
  }

  componentDidMount(){
  	var that = this;
  	this.setState({items: []})
		// fetch("https://apollo.kevinmidboe.com/api/v1/plex/request?query=interstellar")
  //   .then(response => response.json())
  //   .then(data => this.setState({
  //       items: data
  //     })
  //   ).catch(err => console.error('Error load: ', err.toString()));
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.fetchQuery();
    }
  }

  handleErrors(response) {
  	if (!response.ok) {
  		throw Error(response.statusText);
  	}
  	return response;
  }

  fetchQuery() {
    var query = 'https://apollo.kevinmidboe.com/api/v1/plex/request?query=' + this.state.searchQuery;

      fetch(query)
      	// Check if the response is ok
      	.then(response => this.handleErrors(response))
      	.then(response => response.json()) // Convert to json object and pass to next then
	      .then(data => {  // Parse the data of the JSON response
	      	if (data.length > 0) {
	      		this.setState({
	          	items: data
	        	})
	      	} else {
	      		this.setState({
	      			items: null
	      		})
	      	}
	      })
	      .catch(error => console.log('Error submit: ', error.toString()));
  }

  printMovies(item) {
    if (item != undefined) {
      let a = new MovieObject(item);
      return a.getElement();
    }
  }


  handleChange(event){
    this.setState({
      searchQuery: event.target.value
    });
  }

  mapResponseToMovies() {
  	// Here we have some movie response items in our state
  	if (this.state.items) {
  		console.log('something')
  	}
   // And here we are going to print a 404 message because the response was empty
  	else {
  		console.log('nothing')
  	}
  	for (var i = this.state.items.length - 1; i >= 0; i--) {
  		this.printMovies(this.state.items[i])
  	}
  }

  render(){
    return(
      <div>
        <input
          type="text"
          onKeyPress={(event) => this._handleKeyPress(event)}
          onChange={event => this.handleChange(event)}
          value={this.state.searchQuery}
          />
          <button onClick={() => this.fetchQuery()}>Search</button>
          <br></br>

          {this.state.searchQuery}
          <br></br>
            
          {this.mapResponseToMovies()}
      </div>
    )
  }

	
}

export default SearchRequest;