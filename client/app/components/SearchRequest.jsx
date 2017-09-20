import React from 'react';

import MovieObject from './MovieObject.jsx';

// StyleComponents
import searchStyle from './styles/searchRequestStyle.jsx';

import URI from 'urijs';

// TODO add option for searching multi, movies or tv shows
class SearchRequest extends React.Component {
  constructor(props){
    super(props)
    // Constructor with states holding the search query and the element of reponse.
    this.state = {
      searchQuery: '',
      responseMovieList: null,
      movieFilter: true,
      showFilter: false,
      discoverType: '',
      page: 1
    }

    this.allowedDiscoverTypes = [
        'discover', 'popular', 'nowplaying', 'upcoming'
    ]

    this.baseUrl = 'https://apollo.kevinmidboe.com/api/v1/tmdb';
    // this.baseUrl = 'http://localhost:31459/api/v1/tmdb/';

    this.URLs = {
      request: 'https://apollo.kevinmidboe.com/api/v1/plex/request?page='+this.state.page+'&query=',
      // request: 'http://localhost:31459/api/v1/plex/request?page='+this.state.page+'&query=',
      upcoming: 'https://apollo.kevinmidboe.com/api/v1/tmdb/upcoming',
      // upcoming: 'http://localhost:31459/api/v1/tmdb/upcoming',
      sendRequest: 'https://apollo.kevinmidboe.com/api/v1/plex/request?query='
      // sendRequest: 'http://localhost:31459/api/v1/plex/request?query='
    }
  }


  componentDidMount(){
    var that = this;
    // this.setState({responseMovieList: null})
    this.fetchDiscover('upcoming');
  }
  
  // Handles all errors of the response of a fetch call
  handleErrors(response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  }


  fetchDiscover(queryDiscoverType) {
    if (this.allowedDiscoverTypes.indexOf(queryDiscoverType) === -1)
        throw Error('Invalid discover type: ' + queryDiscoverType);

    var uri = new URI(this.baseUrl);
    uri.segment(queryDiscoverType)
    uri = uri.setSearch('page', this.state.page);
    if (this.state.showFilter)
        uri = uri.addSearch('type', 'show');

    console.log(uri)

    this.setState({
        responseMovieList: 'Loading...'
    });

    fetch(uri)
    // Check if the response is ok
    .then(response => this.handleErrors(response))
    .then(response => response.json()) // Convert to json object and pass to next then
    .then(data => {  // Parse the data of the JSON response
      // If it is something here it updates the state variable with the HTML list of all 
      // movie objects that where returned by the search request
      if (data.results.length > 0) {
        this.setState({
          responseMovieList: data.results.map(item => this.createMovieObjects(item))
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


  fetchQuery() {
    let url = this.URLs.request + this.state.searchQuery
    if (this.state.showFilter) {
      url = url + '&type=tv'
    }

  fetch(url)
    // Check if the response is ok
    .then(response => this.handleErrors(response))
    .then(response => response.json()) // Convert to json object and pass to next then
    .then(data => {  // Parse the data of the JSON response
      // If it is something here it updates the state variable with the HTML list of all 
      // movie objects that where returned by the search request
      if (data.results.length > 0) {
        this.setState({
          responseMovieList: data.results.map(item => this.createMovieObjects(item))
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

  toggleFilter(filterType) {
    if (filterType == 'movies') {
      this.setState({
        movieFilter: !this.state.movieFilter
      })
      console.log(this.state.movieFilter);
    } 
    else if (filterType == 'shows') {
      this.setState({
        showFilter: !this.state.showFilter
      })
      console.log(this.state.showFilter);
    }
  }

  pageBackwards() {
    if (this.state.page > 1) {
      console.log('backwards');
      this.state.page--;
      this.getUpcoming();
    }
    console.log(this.state.page)
  }

  pageForwards() {
    this.state.page++;
    this.getUpcoming();
    console.log('forwards');
    console.log(this.state.page)
  }


  render(){
    return(
     <div style={searchStyle.body}>
        <button onClick={() => {this.fetchDiscover('discover')}}>Discover</button>
        <button onClick={() => {this.fetchDiscover('popular')}}>Popular</button>
        <button onClick={() => {this.fetchDiscover('nowplaying')}}>Nowplaying</button>
        <button onClick={() => {this.fetchDiscover('upcoming')}}>Upcoming</button>

          <div className='backgroundHeader' style={searchStyle.backgroundHeader}>
            <div className='pageTitle' style={searchStyle.pageTitle}>
              <span style={searchStyle.pageTitleSpan}>Request new movies or tv shows</span>
            </div>

            <div className='box' style={searchStyle.box}>
              <div style={searchStyle.container}>
                <span style={searchStyle.searchIcon}><i className="fa fa-search"></i></span>

                <input style={searchStyle.searchBar} type="text" id="search" placeholder="Search for new content..." 
                  onKeyPress={(event) => this._handleQueryKeyPress(event)}
                  onChange={event => this.updateQueryState(event)}
                  value={this.state.searchQuery}/>

                <span style={searchStyle.searchFilter}
                  className="search_category hvrUnderlineFromCenter" 
                  onClick={() => {this.toggleFilter('movies')}}
                  id="category_active">Movies</span>
                <span style={searchStyle.searchFilter} 
                  className="search_category hvrUnderlineFromCenter" 
                  onClick={() => {this.toggleFilter('shows')}}
                  id="category_inactive">TV Shows</span>
              </div>
            </div>
          </div>

          <div id='requestMovieList' ref='requestMovieList' style={searchStyle.requestWrapper}>
            {this.state.responseMovieList}     
          </div>
          <div>
            <button onClick={() => {this.pageBackwards()}}>Back</button>
            <button onClick={() => {this.pageForwards()}}>Forward</button>
          </div>
      </div>
    )
  }

  
}

export default SearchRequest;