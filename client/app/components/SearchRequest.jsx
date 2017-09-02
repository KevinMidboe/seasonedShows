import React from 'react';

import MovieObject from './MovieObject.jsx';

// TODO add option for searching multi, movies or tv shows

class SearchRequest extends React.Component {
  constructor(props){
    super(props)
    // Constructor with states holding the search query and the element of reponse.
    this.state = {
      searchQuery: '',
      responseMovieList: null,
      movieFilter: true,
      tvshowFilter: false,
      page: 1
    }

    this.URLs = {
      request: 'https://apollo.kevinmidboe.com/api/v1/plex/request?page='+this.props.page+'&query=',
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
    if (this.state.tvshowFilter) {
      url = url + '&type=tv'
    }

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

  toggleFilter(filterType) {
    if (filterType == 'movies') {
      this.setState({
        movieFilter: !this.state.movieFilter
      })
      console.log(this.state.movieFilter);
    } 
    else if (filterType == 'tvshows') {
      this.setState({
        tvshowFilter: !this.state.tvshowFilter
      })
      console.log(this.state.tvshowFilter);
    }
  }


  render(){

    var body = {
      fontFamily: "'Open Sans', sans-serif",
      backgroundColor: '#f7f7f7',
      margin: 0,
      padding: 0,
      minHeight: '100%',
      position: 'relative'
    }

    var backgroundHeader = {
      width: '100%',
      minHeight: '400px',
      backgroundColor: '#011c23',
      zIndex: 1,
      position: 'absolute'
    }


    var requestWrapper = {
      top: '300px',
      width: '90%',
      maxWidth: '1200px',
      margin: 'auto',
      paddingTop: '20px',
      backgroundColor: 'white',
      position: 'relative',
      zIndex: '10',
      boxShadow: '0 2px 10px grey'
    }

    var pageTitle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }

    var pageTitleSpan = {
      color: 'white',
      fontSize: '3em',
      marginTop: '4vh',
      marginBottom: '6vh'
    }

    var box = {
      width: '90%',
      height: '50px',
      maxWidth: '1200px',
      margin: '0 auto'
    }

    var container = {
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center'
    }

    var searchIcon = {
      position: 'absolute',
      marginLeft: '17px',
      marginTop: '17px',
      zIndex: '1',
      color: '#4f5b66'
    }

    var searchBar = {
      width: '60%',
      minWidth: '120px',
      height: '50px',
      background: '#ffffff',
      border: 'none',
      fontSize: '10pt',
      float: 'left',
      color: '#63717f',
      paddingLeft: '45px',
      borderRadius: '5px',
      marginRight: '15px'
    }

    var searchFilter = {
      color: 'white',
      fontSize: '1em',
      paddingTop: '12px',
      marginBottom: '12px',
      marginLeft: '10px',
      cursor: 'pointer'
    }

    var hvrUnderlineFromCenter = {
      color: 'white',
      fontSize: '1em',
      paddingTop: '12px',
      marginBottom: '12px',
      marginLeft: '10px',
      cursor: 'pointer',
      display: 'inline-block',
      verticalAlign: 'middle',
      WebkitTransform: 'perspective(1px) translateZ(0)',
      transform: 'perspective(1px) translateZ(0)',
      boxShadow: '0 0 1px transparent',
      position: 'relative',
      overflow: 'hidden',
      ':before': {
          content: "",
          position: 'absolute',
          zIndex: '-1',
          left: '50%',
          right: '50%',
          bottom: '0',
          background: '#00d17c',
          height: '2px',
          WebkitTransitionProperty: 'left, right',
          transitionProperty: 'left, right',
          WebkitTransitionDuration: '0.3s',
          transitionDuration: '0.3s',
          WebkitTransitionTimingFunction: 'ease-out',
          transitionTimingFunction: 'ease-out'
      },
      ':hover:before': {
        left: 0,
        right: 0
      },
      'focus:before': {
        left: 0,
        right: 0
      },
      'active:before': {
        left: 0,
        right: 0
      }
    }

    return(
     <div style={body}>
          <div className='backgroundHeader' style={backgroundHeader}>
            <div className='pageTitle' style={pageTitle}>
              <span style={pageTitleSpan}>Request new movies or tv shows</span>
            </div>

            <div className='box' style={box}>
              <div style={container}>
                <span style={searchIcon}><i className="fa fa-search"></i></span>

                <input style={searchBar} type="text" id="search" placeholder="Search for new content..." 
                  onKeyPress={(event) => this._handleQueryKeyPress(event)}
                  onChange={event => this.updateQueryState(event)}
                  value={this.state.searchQuery}/>

                <span style={searchFilter}
                  className="search_category hvrUnderlineFromCenter" 
                  onClick={() => {this.toggleFilter('movies')}}
                  id="category_active">Movies</span>
                <span style={searchFilter} 
                  className="search_category hvrUnderlineFromCenter" 
                  onClick={() => {this.toggleFilter('tvshows')}}
                  id="category_inactive">TV Shows</span>
              </div>
            </div>
          </div>

          <div id='requestMovieList' ref='requestMovieList' style={requestWrapper}>
            {this.state.responseMovieList}     
          </div>
      </div>
    )
  }

  
}

export default SearchRequest;