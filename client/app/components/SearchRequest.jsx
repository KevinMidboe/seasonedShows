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
		fetch("https://apollo.kevinmidboe.com/api/v1/plex/request?query=interstellar")
    .then(response => response.json())
    .then(data => this.setState({
        items: data
      })
    ).catch(err => console.error('Error load: ', err.toString()));
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.fetchQuery();
    }
  }

  fetchQuery() {
    var query = 'https://apollo.kevinmidboe.com/api/v1/plex/request?query=' + this.state.searchQuery;

      fetch(query)
      .then(response => response.json())
      .then(data => this.setState({
          items: data
        })
      ).catch(err => console.error('Error submit: ', err.toString()));
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
            
          {this.state.items.map((item) => this.printMovies(item))}
      </div>
    )
  }

	
}

export default SearchRequest;