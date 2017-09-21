import React from 'react';

import MovieObject from './MovieObject.jsx';

// StyleComponents
import searchStyle from './styles/searchRequestStyle.jsx';
import movieStyle from './styles/movieObjectStyle.jsx'

import URI from 'urijs';

// TODO add option for searching multi, movies or tv shows
class SearchRequest extends React.Component {
  constructor(props){
    super(props)
    // Constructor with states holding the search query and the element of reponse.
    this.state = {
      lastApiCallURI: '',
      searchQuery: '',
      responseMovieList: null,
      movieFilter: true,
      showFilter: false,
      discoverType: '',
      page: 1,
      resultHeader: ''
    }

    this.allowedListTypes = [
        'discover', 'popular', 'nowplaying', 'upcoming'
    ]

    this.baseUrl = 'https://apollo.kevinmidboe.com/api/v1/tmdb/';
    // this.baseUrl = 'http://localhost:31459/api/v1/tmdb/';

    this.URLs = {
      searchRequest: 'https://apollo.kevinmidboe.com/api/v1/plex/request',
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
    this.fetchTmdbList('upcoming');
  }
  
    // Handles all errors of the response of a fetch call
    handleErrors(response) {
        if (!response.ok)
            throw Error(response.status);
        return response;
    }

    handleQueryError(response) {
        if (!response.ok) {
            if (response.status === 404) {
                this.setState({
                    responseMovieList: <h1>Nothing found for search query: { this.findQueryInURI(uri) }</h1>
                })
            }
            console.log(error);
        }
        return response;
    }

    // Unpacks the query value of a uri
    findQueryValueInURI(uri) {
        let uriSearchValues = uri.query(true);
        let queryValue = uriSearchValues['query']

        return queryValue;
    }

    resetPageNumber() {
        this.state.page = 1;
    }

    writeLoading() {
        this.setState({
            responseMovieList: 'Loading...'
        });
    }

    // Test this by calling missing endpoint or 404 query and see what code
    // and filter the error message based on the code.
    // Calls a uri and returns the response as json
    callURI(uri) {
        return fetch(uri)
        .then(response => { return response })
        .catch(error => {
            throw Error('Something went wrong while fetching URI.');
        });
    }

    // Saves the input string as a h1 element in responseMovieList state
    fillResponseMovieListWithError(msg) {
        this.setState({
            responseMovieList: <h1>{ msg }</h1>
        })
    }


    // Here we first call api for a search with the input uri, handle any errors
    // and fill the reponseData from api into the state of reponseMovieList as movieObjects
    callSearchFillMovieList(uri) {
        // Write loading animation
        // this.writeLoading();
        
        Promise.resolve()
        .then(() => this.callURI(uri))
        .then(response => {
            // If we get a error code for the request
            if (!response.ok) {
                if (response.status === 404) {
                    let errorMsg = 'Nothing found for the search query: ' + this.findQueryValueInURI(uri);
                    this.fillResponseMovieListWithError(errorMsg)
                }
                else {
                    let errorMsg = 'Error fetching query from server ' + this.response.status;
                    this.fillResponseMovieListWithError(errorMsg) 
                }
            }

            // Convert to json and update the state of responseMovieList with the results of the api call
            // mapped as a movieObject.
            response.json()
            .then(responseData => {
                if (this.state.page === 1) {
                    this.setState({
                        responseMovieList: responseData.results.map(searchResultItem => this.createMovieObjects(searchResultItem)),
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                } else {
                    let responseMovieObjects = responseData.results.map(searchResultItem => this.createMovieObjects(searchResultItem));
                    let growingReponseMovieObjectList = this.state.responseMovieList.concat(responseMovieObjects);
                    this.setState({
                        responseMovieList: growingReponseMovieObjectList,
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch(() => {
            throw Error('Something went wrong when fetching query.')
        })
    }

    callListFillMovieList(uri) {
        // Write loading animation
        // this.writeLoading();
        
        Promise.resolve()
        .then(() => this.callURI(uri))
        .then(response => {
            // If we get a error code for the request
            if (!response.ok) {
                if (response.status === 404) {
                    let errorMsg = 'List not found';
                    this.fillResponseMovieListWithError(errorMsg)
                }
                else {
                    let errorMsg = 'Error fetching list from server ' + this.response.status;
                    this.fillResponseMovieListWithError(errorMsg) 
                }
            }

            // Convert to json and update the state of responseMovieList with the results of the api call
            // mapped as a movieObject.
            response.json()
            .then(responseData => {
                if (this.state.page === 1) {
                    this.setState({
                        responseMovieList: responseData.results.map(searchResultItem => this.createMovieObjects(searchResultItem)),
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                } else {
                    let responseMovieObjects = responseData.results.map(searchResultItem => this.createMovieObjects(searchResultItem));
                    let growingReponseMovieObjectList = this.state.responseMovieList.concat(responseMovieObjects);
                    this.setState({
                        responseMovieList: growingReponseMovieObjectList,
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                }
            })
        })
        .catch(() => {
            throw Error('Something went wrong when fetching query.')
        })
    }

    searchSeasonedRequest() {
        // Build uri with the url for searching requests
        var uri = new URI(this.URLs.searchRequest);
        // Add input of search query and page count to the uri payload
        uri = uri.search({ 'query': this.state.searchQuery, 'page': this.state.page });
        
        if (this.state.showFilter)
            uri = uri.addSearch('type', 'show');

        // Send uri to call and fill the response list with movie/show objects
        this.callSearchFillMovieList(uri);
    }

    fetchTmdbList(tmdbListType) {
        // Check if it is a whitelisted list, this should be replaced with checking if the return call is 500
        if (this.allowedListTypes.indexOf(tmdbListType) === -1)
            throw Error('Invalid discover type: ' + tmdbListType);

        // Captialize the first letter of and save the discoverQueryType to resultHeader state. 
        this.state.resultHeader = tmdbListType.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        // Build uri with the url for searching requests
        var uri = new URI(this.baseUrl);
        uri.segment(tmdbListType);
        // Add input of search query and page count to the uri payload
        uri = uri.search({ 'page': this.state.page });
        
        if (this.state.showFilter)
            uri = uri.addSearch('type', 'show');

        // Send uri to call and fill the response list with movie/show objects
        this.callListFillMovieList(uri);
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
        // this.fetchQuery();
        // Reset page number for a new search
        this.resetPageNumber();
        this.searchSeasonedRequest();
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
            let pageNumber = this.state.page - 1;
            let uri = this.state.lastApiCallURI;
            
            // Augment the page number of the uri with a callback
            uri.search(function(data) {
                data.page = pageNumber;
            });

            // Call the api with the new uri
            this.callSearchFillMovieList(uri);
            // Update state of our page number after the call is done
            this.state.page = pageNumber;
            }
    }

    // TODO need to get total page number and save in a state to not overflow
    pageForwards() {
        // Wrap this in the check
        let pageNumber = this.state.page + 1;
        let uri = this.state.lastApiCallURI;
        
        // Augment the page number of the uri with a callback
        uri.search(function(data) {
            data.page = pageNumber;
        });

        // Call the api with the new uri
        this.callSearchFillMovieList(uri);
        // Update state of our page number after the call is done
        this.state.page = pageNumber;
    }


  render(){
    return(
     <div style={searchStyle.body}>
        <button onClick={() => {this.fetchTmdbList('discover')}}>Discover</button>
        <button onClick={() => {this.fetchTmdbList('popular')}}>Popular</button>
        <button onClick={() => {this.fetchTmdbList('nowplaying')}}>Nowplaying</button>
        <button onClick={() => {this.fetchTmdbList('upcoming')}}>Upcoming</button>

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
          
          <h1 style={searchStyle.resultHeader}>{this.state.resultHeader}</h1>
          
          {this.state.responseMovieList}     
        </div>
        
        <div style={searchStyle.pageNavigationBar}>
          <button onClick={() => {this.pageBackwards()}} style={searchStyle.pageNavigationButton}>Back</button>
          <button onClick={() => {this.pageForwards()}} style={searchStyle.pageNavigationButton}>Forward</button>
        </div>
    </div>
    )
  }

  
}

export default SearchRequest;