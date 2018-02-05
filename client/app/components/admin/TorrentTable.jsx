import React, { Component } from 'react';

import { fetchJSON } from '../http.jsx';

import torrentTableCSS from '../styles/adminTorrentTable.jsx';

class TorrentTable extends Component {
   constructor() {
      super();
      this.state = {
         torrentResponse: [],
         listElements: undefined,
         showTable: false,
         filterQuery: '',
         sortValue: 'name',
         sortDesc: true,
      }

      this.UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   }

   componentWillReceiveProps(props) {
      if (props.response !== undefined && props.response !== this.state.torrentResponse) {
         console.log('not called', props)
         this.setState({
            torrentResponse: props.response,
            showTable: true,
         })
      } else {
         this.setState({
            showTable: false,
         })
      }
   }


   // BORROWED FROM GITHUB user sindresorhus
   // Link to repo: https://github.com/sindresorhus/pretty-bytes
   convertSizeToHumanSize(num) {
      if (!Number.isFinite(num)) {
         return num
         // throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
      }
      const neg = num < 0;
      
      if (neg) {
         num = -num;
      }

      if (num < 1) {
         return (neg ? '-' : '') + num + ' B';
      }

      const exponent = Math.min(Math.floor(Math.log10(num) / 3), this.UNITS.length - 1);
      const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
      const unit = this.UNITS[exponent];

      return (neg ? '-' : '') + numStr + ' ' + unit;
   }

   convertHumanSizeToBytes(string) {
      const [numStr, unit] = string.split(' ');
      if (this.UNITS.indexOf(unit) === -1) {
         return string
      }

      const exponent = this.UNITS.indexOf(unit) * 3
      
      return numStr * (Math.pow(10, exponent))
   }

   sendToDownload(magnet) {
      const apiData = {
        magnet: magnet,
      }

      fetchJSON('https://apollo.kevinmidboe.com/api/v1/pirate/add', 'POST', apiData)
      // fetchJSON('http://localhost:31459/api/v1/pirate/add', 'POST', apiData)
      .then((response) => {
         console.log('Response, addMagnet: ', response)
         // TODO Display the feedback in a notification component (text, status)
      })
   }

   // Updates the internal state of the query filter and updates the list to only 
   // display names matching the query. This is real-time filtering.
   updateFilterQuery(event) {
      const query = event.target.value;

      let filteredByQuery = this.props.response.map((item, index) => {
         if (item.name.toLowerCase().indexOf(query.toLowerCase()) != -1)
            return item
      })

      this.setState({
         torrentResponse: filteredByQuery,
         filterQuery: query,
      });
   }


   sortTable(col) {
      let direction = this.state.sortDesc;
      if (col === this.state.sortValue) 
         direction = !direction;
      else
         direction = true
      
      let sortedItems = this.state.torrentResponse.sort((a,b) => {
         // This is so we also can sort string that only contain numbers
         let valueA = isNaN(a[col]) ? a[col] : parseInt(a[col])
         let valueB = isNaN(b[col]) ? b[col] : parseInt(b[col])

         valueA = (col == 'size') ? this.convertHumanSizeToBytes(valueA) : valueA
         valueB = (col == 'size') ? this.convertHumanSizeToBytes(valueB) : valueB

         if (direction)
            return valueA<valueB? 1:valueA>valueB?-1:0;
         else
            return valueA>valueB? 1:valueA<valueB?-1:0;
      })

      this.setState({
         torrentResponse: sortedItems,
         sortDesc: direction,
         sortValue: col,
      })
   }

   generateFilterSearch() {
      return (
         <div style={torrentTableCSS.searchSidebar}>
            <div style={torrentTableCSS.searchInner}>
               <input
                  type="text" 
                  id="search"
                  style={torrentTableCSS.searchTextField}
                  placeholder="Filter torrents by query" 
                  onChange={event => this.updateFilterQuery(event)}
                  value={this.state.filterQuery}/>
               <span>
                  <svg id="icon-search" style={torrentTableCSS.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                     <g id="search">
                        <circle style={torrentTableCSS.searchSVGIcon} cx="6.055" cy="5.805" r="5.305"></circle>
                        <path style={torrentTableCSS.searchSVGIcon} d="M9.847 9.727l4.166 4.773"></path>
                     </g>
                  </svg>
               </span>
            </div>
         </div>
      )
   }

   generateListElements() {
      let listElements = this.state.torrentResponse.map((item, index) => {
         if (item !== undefined) {
            let title = item.name
            let size = this.convertSizeToHumanSize(item.size)

            return (
               <tr key={index} style={torrentTableCSS.bodyCol}>
                  <td>{ item.name }</td>
                  <td>{ item.uploader }</td>
                  <td>{ size }</td>
                  <td>{ item.seed }</td>
                  <td><button onClick = { event => this.sendToDownload(item.magnet) }>Send to download</button></td>
               </tr>
            )
         }
      })
      return listElements
   }

   render() {
      return (
         <div style= { this.state.showTable ? null : {display: 'none'}}>
            { this.generateFilterSearch() }
            <table style={torrentTableCSS.table} cellSpacing="0" cellPadding="0">
               <thead>
                  <tr>
                     <th style={torrentTableCSS.col} onClick = {event => this.sortTable('name') }>
                        Title
                        <svg style={ ( this.state.sortDesc && this.state.sortValue == 'name' ) ? null : {transform: 'rotate(180deg)'} } height="15" viewBox="0 3.5 10 13" version="1.1" width="25" aria-hidden="true"><path fillRule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path></svg>
                     </th>
                     <th style={torrentTableCSS.col} onClick = {event => this.sortTable('uploader') }>
                        Uploader
                        <svg style={ ( this.state.sortDesc && this.state.sortValue == 'uploader' ) ? null : {transform: 'rotate(180deg)'} } height="15" viewBox="0 3.5 10 13" version="1.1" width="25" aria-hidden="true"><path fillRule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path></svg>
                     </th>
                     <th style={torrentTableCSS.col} onClick = {event => this.sortTable('size') }>
                        Size
                        <svg style={ ( this.state.sortDesc && this.state.sortValue == 'size' ) ? null : {transform: 'rotate(180deg)'} } height="15" viewBox="0 3.5 10 13" version="1.1" width="25" aria-hidden="true"><path fillRule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path></svg>
                     </th>
                     <th style={torrentTableCSS.col} onClick = {event => this.sortTable('seed') }>
                        Seeds
                        <svg style={ ( this.state.sortDesc && this.state.sortValue == 'seed' ) ? null : {transform: 'rotate(180deg)'} } height="15" viewBox="0 3.5 10 13" version="1.1" width="25" aria-hidden="true"><path fillRule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path></svg>
                     </th>
                     <th style={torrentTableCSS.col}>Magnet</th>
                  </tr>
               </thead>
               <tbody>
                  {this.generateListElements()}
               </tbody>
            </table>
         </div>
      )
   }
}

export default TorrentTable;
