import React, { Component } from 'react';
import { fetchJSON } from '../http.jsx'; 

// Components
import TorrentTable from './torrentTable.jsx'

// Stylesheets
import btnStylesheet from '../styles/buttons.jsx';

// Interactive button
import Interactive from 'react-interactive';

import Loading from '../images/loading.jsx'

class PirateSearch extends Component {
   constructor() {
      super();
      this.state = {
         torrentResponse: undefined,
         name: '',
         loading: null,
         showButton: true,
      }
   }

   componentWillReceiveProps(props) {
      if (props.name != this.state.name) {
         this.setState({
            torrentResponse: undefined,
            showButton: true,
         })
      }
   }

   searchTheBay() {
      const query = this.props.name;
      const type = this.props.type;

      this.setState({
         showButton: false,
         loading: <Loading />,
      })

      fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/search?query='+query+'&type='+type, 'GET')
      // fetchJSON('http://localhost:31459/api/v1/pirate/search?query='+query+'&type='+type, 'GET')
      .then((response) => {
         this.setState({
            torrentResponse: response.torrents,
            loading: null,
         })
      })
      .catch((error) => {
         console.error(error);
         this.setState({
            showButton: true,
         })
      })
   }

   render() {
      btnStylesheet.submit.top = '50%'
      btnStylesheet.submit.position = 'absolute'
      btnStylesheet.submit.marginLeft = '-75px'

      return (
         <div>
            { this.state.showButton ? 
            <div style={{textAlign:'center'}}>
               <Interactive 
                  as='button'
                  onClick={() => {this.searchTheBay()}}
                  style={btnStylesheet.submit}
                  focus={btnStylesheet.submit_hover}
                  hover={btnStylesheet.submit_hover}>

                  <span style={{whiteSpace: 'nowrap'}}>Search for torrents</span>
               </Interactive>
            </div>
            : null }

            { this.state.loading }

            <TorrentTable response={this.state.torrentResponse} />
         </div>
      )
   }
}

export default PirateSearch
