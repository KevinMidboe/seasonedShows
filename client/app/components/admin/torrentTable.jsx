import React, { Component } from 'react';

import { fetchJSON } from '../http.jsx'; 

class TorrentTable extends Component {
   
   constructor() {
      super();
      this.state = {
         torrentResponse: '',
         showResults: false,
      }
   }

   componentWillReceiveProps(props) {
      if (props.response !== undefined) {
         this.setState({
            torrentResponse: props.response.map((torrent, index) => {
               return (
                  <tr key={index}>
                     <td>{torrent.name}</td>
                     <td>{torrent.size}</td>
                     <td>{torrent.seed}</td>
                     <td><button onClick={() => {this.sendToDownload(torrent)}}>Send to download</button></td>
                  </tr>
               )
            }),
            showResults: true,
         })
      }
      else {
         this.setState({
            showResults: false,
         })
      }
   }

   sendToDownload(torrent) {
      let data = {magnet: torrent.magnet}
      fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/add', 'POST', data)
      .then((response) => {
         // TODO: Show a card with response that the item has been sent, and the status of response.
         console.log(response)
      })
      .catch((error) => {
         console.error(error);
      })
   }

   generateTable() {
      let style = {
         table: {
            width: '80%',
            marginRight: 'auto',
            marginLeft: 'auto',
         },
      }

      return (
         <table style={style.table}>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Seed</th>
                  <th>Add</th>
               </tr>
            </thead>
            <tbody>
               { this.state.torrentResponse }
            </tbody>
         </table>
      );
   }

   render() {
      return (
         <div>
            { this.state.showResults ? this.generateTable() : null }
         </div>
      )
   }
}

export default TorrentTable