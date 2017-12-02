import React from 'react';

import Notifications, {notify} from 'react-notify-toast';

// StyleComponents
import searchObjectCSS from './styles/searchObject.jsx';
import buttonsCSS from './styles/buttons.jsx';

var MediaQuery = require('react-responsive');

import { fetchJSON } from './http.jsx';

import Interactive from 'react-interactive';


class SearchObject {
    constructor(object) {
        this.id = object.id;
        this.title = object.title;
        this.year = object.year;
        this.type = object.type;
        this.rating = object.rating;
        this.poster = object.poster;
        this.background = object.background;
        this.matchedInPlex = object.matchedInPlex;
        this.summary = object.summary;
    }

    requestExisting(movie) {
        console.log('Exists', movie);
    }

    requestMovie() {
        fetchJSON('https://apollo.kevinmidboe.com/api/v1/plex/request/' + this.id + '?type='+this.type, 'POST')
        .then((response) => {
            console.log(response);
            notify.show(this.title + ' requested!', 'success', 3000);
        })
        .catch((e) => {
            console.error('Request movie fetch went wrong: '+ e);
        })

    }

    getElement(index) {
      const element_key = index + this.id;

      if (this.poster == null || this.poster == undefined) {
         var posterPath = 'https://openclipart.org/image/2400px/svg_to_png/211479/Simple-Image-Not-Found-Icon.png'
      } else {
         var posterPath = 'https://image.tmdb.org/t/p/w300' + this.poster;
      }
      var backgroundPath = 'https://image.tmdb.org/t/p/w640_and_h360_bestv2/' + this.background;

      var foundInPlex;
      if (this.matchedInPlex) {
         foundInPlex = <Interactive 
            as='button'
            onClick={() => {this.requestExisting(this)}} 
            style={buttonsCSS.submit}
            focus={buttonsCSS.submit_hover}
            hover={buttonsCSS.submit_hover}>

            <span>Request Anyway</span>
         </Interactive>;
      } else {
         foundInPlex = <Interactive 
            as='button'
            onClick={() => {this.requestMovie()}} 
            style={buttonsCSS.submit}
            focus={buttonsCSS.submit_hover}
            hover={buttonsCSS.submit_hover}>

            <span>&#x0002B; Request</span>
         </Interactive>;
      }

      if (this.type === 'movie') 
         var themoviedbLink = 'https://www.themoviedb.org/movie/' + this.id
      else if (this.type === 'show')  
         var themoviedbLink = 'https://www.themoviedb.org/tv/' + this.id

      // TODO go away from using mediaQuery, and create custom resizer
      return (
         <div key={element_key}>
         <Notifications />
         
         <div style={searchObjectCSS.container} key={this.id}>
            <MediaQuery minWidth={600}>
               <div style={searchObjectCSS.posterContainer}>
                  <img style={searchObjectCSS.posterImage} id='poster' src={posterPath}></img>
               </div>
               <span style={searchObjectCSS.title_large}>{this.title}</span>
               <br></br>
               <span style={searchObjectCSS.stats_large}>Released: { this.year } | Rating: {this.rating}</span>
               <br></br>
               <span style={searchObjectCSS.summary}>{this.summary}</span>
               <br></br>
            </MediaQuery>

            <MediaQuery maxWidth={600}>
               <img src={ backgroundPath } style={searchObjectCSS.backgroundImage}></img>
               <span style={searchObjectCSS.title_small}>{this.title}</span>
               <br></br>
               <span style={searchObjectCSS.stats_small}>Released: {this.year} | Rating: {this.rating}</span>
            </MediaQuery>

            <div style={searchObjectCSS.buttons}>
               {foundInPlex}
               
               <a href={themoviedbLink}>
                  <Interactive 
                     as='button'
                     hover={buttonsCSS.info_hover}
                     focus={buttonsCSS.info_hover}
                     style={buttonsCSS.info}>

                     <span>Info</span>
                  </Interactive>
               </a>
            </div>
         </div>
         
         <MediaQuery maxWidth={600}>
             <br />
         </MediaQuery>
         
         <div style={searchObjectCSS.dividerRow}>
             <div style={searchObjectCSS.itemDivider}></div>
         </div>
         </div>
      )

    }
}

export default SearchObject;