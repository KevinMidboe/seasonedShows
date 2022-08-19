import React from 'react';

import URI from 'urijs';
import InfiniteScroll from 'react-infinite-scroller';

// StyleComponents
import searchRequestCSS from './styles/searchRequestStyle.jsx';

import SearchObject from './SearchObject.jsx';
import Loading from './images/loading.jsx'

import { fetchJSON } from './http.jsx';
import { getCookie } from './Cookie.jsx';

var MediaQuery = require('react-responsive');

// TODO add option for searching multi, movies or tv shows
class SearchRequest extends React.Component {
  constructor(props){
    super(props)
    // Constructor with states holding the search query and the element of reponse.
    this.state = {
      lastApiCallURI: '',
      searchQuery: '',
      responseMovieList: null,
      movieFilter: false,
      showFilter: false,
      discoverType: '',
      page: 1,
      resultHeader: '',
      loadResults: false,
      scrollHasMore: true,
      loading: false,
    }

    this.allowedListTypes = ['discover', 'popular', 'nowplaying', 'upcoming']

    this.baseUrl = 'https://apollo.kevinmidboe.com/api/v1/tmdb/list';
    // this.baseUrl = 'http://localhost:31459/api/v1/tmdb/list';
    this.searchUrl = 'https://apollo.kevinmidboe.com/api/v1/plex/request';
    // this.searchUrl = 'http://localhost:31459/api/v1/plex/request';
  }


  componentWillMount(){
    var that = this;
    // this.setState({responseMovieList: null})
    this.resetPageNumber();
    this.state.loadResults = true;
    this.fetchTmdbList(this.allowedListTypes[Math.floor(Math.random()*this.allowedListTypes.length)]);
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
            console.log('handleQueryError: ', error);
        }
        return response;
    }

    // Unpacks the query value of a uri
    findQueryValueInURI(uri) {
        let uriSearchValues = uri.query(true);
        let queryValue = uriSearchValues['query']

        return queryValue;
    }

    // Unpacks the page value of a uri
    findPageValueInURI(uri) {
        let uriSearchValues = uri.query(true);
        let queryValue = uriSearchValues['page']

        return queryValue;
    }

    resetPageNumber() {
        this.state.page = 1;
    }

    setLoading(value) {
        this.setState({
            loading: value
        });
    }

    // Test this by calling missing endpoint or 404 query and see what code
    // and filter the error message based on the code.
    // Calls a uri and returns the response as json
    callURI(uri, method, data={}) {
        return fetch(uri, {
            method: method,
            headers: new Headers({
              'Content-Type': 'application/json',
              'authorization': getCookie('token'),
              'loggedinuser': getCookie('loggedInUser'),
            })
        })
        .then(response => { return response })
        .catch((error) => {
            throw Error(error);
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
        Promise.resolve()
        .then(() => this.callURI(uri, 'GET'))
        .then(response => {
            // If we get a error code for the request
            if (!response.ok) {
                if (response.status === 404) {
                    if (this.findPageValueInURI(new URI(response.url)) > 1) {
                        this.state.scrollHasMore = false;
                        console.log(this.state.scrollHasMore)
                        return null
                        let returnMessage = 'this is the return mesasge than will never be delivered'
                        let theSecondReturnMsg = 'this is the second return messag ethat will NEVE be delivered'
                    }
                    else {                    

                        let errorMsg = 'Nothing found for the search query: ' + this.findQueryValueInURI(uri);
                        this.fillResponseMovieListWithError(errorMsg)
                    }
                }
                else {
                    let errorMsg = 'Error fetching query from server ' + this.response.status;
                    this.fillResponseMovieListWithError(errorMsg) 
                }
            }

            // Convert to json and update the state of responseMovieList with the results of the api call
            // mapped as a SearchObject.
            response.json()
            .then(responseData => {
                if (this.state.page === 1) {
                    this.setState({
                        responseMovieList: responseData.results.map((searchResultItem, index) => this.createMovieObjects(searchResultItem, index)),
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                } else {
                    let responseMovieObjects = responseData.results.map((searchResultItem, index) => this.createMovieObjects(searchResultItem, index));
                    let growingReponseMovieObjectList = this.state.responseMovieList.concat(responseMovieObjects);
                    this.setState({
                        responseMovieList: growingReponseMovieObjectList,
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                }
            })
            .catch((error) => {
                console.log('CallSearchFillMovieList: ', error)
            })
        })
        .catch((error) => {
            console.log('Something went wrong when fetching query.', error)
        })
    }

    callListFillMovieList(uri) {
        // Write loading animation
        
        Promise.resolve()
        .then(() => this.callURI(uri, 'GET', undefined))
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
            // mapped as a SearchObject.
            response.json()
            .then(responseData => {
                if (this.state.page === 1) {
                    this.setState({
                        responseMovieList: responseData.results.map((searchResultItem, index) => this.createMovieObjects(searchResultItem, index)),
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                } else {
                    let responseMovieObjects = responseData.results.map((searchResultItem, index) => this.createMovieObjects(searchResultItem, index));
                    let growingReponseMovieObjectList = this.state.responseMovieList.concat(responseMovieObjects);
                    this.setState({
                        responseMovieList: growingReponseMovieObjectList,
                        lastApiCallURI: uri  // Save the value of the last sucessfull api call
                    })
                }
            })
        })
        .catch((error) => {
            console.log('Something went wrong when fetching query.', error)

        })
    }

    searchSeasonedRequest() {
        this.state.resultHeader = 'Search result for: ' + this.state.searchQuery;

        // Build uri with the url for searching requests
        var uri = new URI(this.searchUrl);
        // Add input of search query and page count to the uri payload
        uri = uri.search({ 'query': this.state.searchQuery, 'page': this.state.page });
        
        if (this.state.showFilter)
            uri = uri.addSearch('type', 'show');
        else 
            if (this.state.movieFilter)
                uri = uri.addSearch('type', 'movie')

        // Send uri to call and fill the response list with movie/show objects
        this.callSearchFillMovieList(uri);
    }

    fetchTmdbList(tmdbListType) {
        console.log(tmdbListType)
        // Check if it is a whitelisted list, this should be replaced with checking if the return call is 500
        if (this.allowedListTypes.indexOf(tmdbListType) === -1)
            throw Error('Invalid discover type: ' + tmdbListType);

        this.state.responseMovieList = []
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

  // When called passes the variable to SearchObject and calls it's interal function for 
  // generating the wanted HTML
  createMovieObjects(item, index) {
    let movie = new SearchObject(item);
    return movie.getElement(index);
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

    movieToggle() {
        if (this.state.movieFilter) 
            return <span style={searchRequestCSS.searchFilterActive}
                className="search_category hvrUnderlineFromCenter" 
                onClick={() => {this.toggleFilter('movies')}}
                id="category_active">Movies</span>
        else
            return <span style={searchRequestCSS.searchFilterNotActive}
                className="search_category hvrUnderlineFromCenter" 
                onClick={() => {this.toggleFilter('movies')}}
                id="category_active">Movies</span>
    }

    showToggle() {
        if (this.state.showFilter) 
            return <span style={searchRequestCSS.searchFilterActive}
                className="search_category hvrUnderlineFromCenter" 
                onClick={() => {this.toggleFilter('shows')}}
                id="category_active">TV Shows</span>
        else
            return <span style={searchRequestCSS.searchFilterNotActive}
                className="search_category hvrUnderlineFromCenter" 
                onClick={() => {this.toggleFilter('shows')}}
                id="category_active">TV Shows</span>
    }


  render(){
    const loader = <div className="loader">Loading ...<br></br></div>;


    return(
         <InfiniteScroll
                pageStart={0}
                loadMore={this.pageForwards.bind(this)}
                hasMore={this.state.scrollHasMore}
                loader={<Loading />}
                initialLoad={this.state.loadResults}>

                <MediaQuery minWidth={600}>
                    <div style={searchRequestCSS.body}>
                        <div className='backgroundHeader' style={searchRequestCSS.backgroundLargeHeader}>
                            <div className='pageTitle' style={searchRequestCSS.pageTitle}>
                                <span style={searchRequestCSS.pageTitleLargeSpan}>Request new content for plex</span>
                            </div>
                            
                            <div style={searchRequestCSS.searchLargeContainer}>
                                <span style={searchRequestCSS.searchIcon}><i className="fa fa-search"></i></span>

                                <input style={searchRequestCSS.searchLargeBar} type="text" id="search" placeholder="Search for new content..." 
                                onKeyPress={(event) => this._handleQueryKeyPress(event)}
                                onChange={event => this.updateQueryState(event)}
                                value={this.state.searchQuery}/>

                            </div>
                        </div>

                        <div id='requestMovieList' ref='requestMovieList' style={searchRequestCSS.requestWrapper}>
                            <div style={{marginLeft: '30px'}}>
                               <div style={searchRequestCSS.resultLargeHeader}>{this.state.resultHeader}</div>
                               <span style={{content: '', display: 'block', width: '2em', borderTop: '2px solid #000,'}}></span>
                            
                            </div>

                           <br></br>

                           {this.state.responseMovieList}
                        </div>
                    </div>
                </MediaQuery>

                <MediaQuery maxWidth={600}>
                     <div style={searchRequestCSS.body}>
                        <div className='backgroundHeader' style={searchRequestCSS.backgroundSmallHeader}>
                            <div className='pageTitle' style={searchRequestCSS.pageTitle}>
                                <span style={searchRequestCSS.pageTitleSmallSpan}>Request new content</span>
                            </div>
                            
                            <div className='box' style={searchRequestCSS.box}>
                                <div style={searchRequestCSS.searchSmallContainer}>
                                    <span style={searchRequestCSS.searchIcon}><i className="fa fa-search"></i></span>

                                    <input style={searchRequestCSS.searchSmallBar} type="text" id="search" placeholder="Search for new content..." 
                                    onKeyPress={(event) => this._handleQueryKeyPress(event)}
                                    onChange={event => this.updateQueryState(event)}
                                    value={this.state.searchQuery}/>

                                </div>
                            </div>
                        </div>

                        <div id='requestMovieList' ref='requestMovieList' style={searchRequestCSS.requestWrapper}>
                            <span style={searchRequestCSS.resultSmallHeader}>{this.state.resultHeader}</span>
                            <br></br><br></br>

                            {this.state.responseMovieList}
                        </div>
                    </div>
                </MediaQuery>
            </InfiniteScroll>
    )
  }

    // <form style={searchRequestCSS.controls}>
    //     <label style={searchRequestCSS.withData}>
    //         <div style={searchRequestCSS.sortOptions}>Discover</div>
    //     </label>
    // </form>

    // <form style={searchRequestCSS.controls}>
    //     <label style={searchRequestCSS.withData}>
    //         <select style={searchRequestCSS.sortOptions}>
    //             <option value="discover">All</option>
    //             <option value="nowplaying">Movies</option>
    //             <option value="nowplaying">TV Shows</option>
    //         </select>
    //     </label>
    // </form>
}

export default SearchRequest;
