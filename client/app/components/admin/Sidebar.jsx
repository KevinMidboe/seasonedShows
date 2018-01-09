import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Interactive from 'react-interactive';

import sidebarCSS from '../styles/adminSidebar.jsx'

class SidebarComponent extends Component {  

   constructor(props){
      super(props)
      // Constructor with states holding the search query and the element of reponse.
      this.state = {
         filterValue: '',
         filterQuery: '',
         requestItemsToBeDisplayed: [],
         listItemSelected: '',
         height: '0',
      }

      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
   }

   // Where we wait for api response to be delivered from parent through props
   componentWillReceiveProps(props) {
      this.state.listItemSelected = props.listItemSelected;
      this.displayRequestedElementsInfo(props.requested_objects);
   }

   componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
   }

   updateWindowDimensions() {
      this.setState({ height: window.innerHeight });
   }

   // Inputs a date and returns a text string that matches how long it was since
   convertDateToDaysSince(date) {
      var oneDay = 24*60*60*1000;
      var firstDate = new Date(date);
      var secondDate = new Date();

      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
      
      switch (diffDays) {
         case 0:
            return 'Today';
         case 1:
            return '1 day ago'
         default:
            return diffDays + ' days ago'
      }
   }

   // Called from our dropdown, receives a filter string and checks it with status field 
   // of our request objects. 
   filterItems(filterValue) {
      let filteredRequestElements = this.props.requested_objects.map((item, index) => {
         if (item.status === filterValue || filterValue === 'all')
            return this.generateListElements(index, item);
      })

      this.setState({
         requestItemsToBeDisplayed: filteredRequestElements,
         filterValue: filterValue,
      })
   }


   // Updates the internal state of the query filter and updates the list to only 
   // display names matching the query. This is real-time filtering.
   updateFilterQuery(event) {
      const query = event.target.value;

      let filteredByQuery = this.props.requested_objects.map((item, index) => {
         if (item.name.toLowerCase().indexOf(query.toLowerCase()) != -1)
            return this.generateListElements(index, item);
      })

      console.log(filteredByQuery)
      this.setState({
         requestItemsToBeDisplayed: filteredByQuery,
         filterQuery: query,
      });
   }


   generateFilterSearch() {
      return (
         <div style={sidebarCSS.searchSidebar}>
            <div style={sidebarCSS.searchInner}>
               <input
                  type="text" 
                  id="search"
                  style={sidebarCSS.searchTextField}
                  placeholder="Search requested items" 
                  onChange={event => this.updateFilterQuery(event)}
                  value={this.state.filterQuery}/>
               <span>
                  <svg id="icon-search" style={sidebarCSS.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                     <g id="search">
                        <circle style={sidebarCSS.searchSVGIcon} cx="6.055" cy="5.805" r="5.305"></circle>
                        <path style={sidebarCSS.searchSVGIcon} d="M9.847 9.727l4.166 4.773"></path>
                     </g>
                  </svg>
               </span>
            </div>
         </div>
      )
   }

   generateNav() {
      let filterValue = this.state.filterValue;

      return (
         <nav style={sidebarCSS.sidebar_navbar_underline}>
            <ul style={sidebarCSS.ulFilterSelectors}>
               <li>
                  <span style={sidebarCSS.aFilterSelectors} onClick = { event => this.filterItems('all') }>All</span>
                  { (filterValue === 'all' || filterValue === '') && <span style={sidebarCSS.spanFilterSelectors}></span> }
               </li>

               <li>
                  <span style={sidebarCSS.aFilterSelectors} onClick = { event => this.filterItems('requested') }>Requested</span>
                  { filterValue === 'requested' && <span style={sidebarCSS.spanFilterSelectors}></span> }
               </li>

               <li>
                  <span style={sidebarCSS.aFilterSelectors} onClick = { event => this.filterItems('downloading') }>Downloading</span>
                  { filterValue === 'downloading' && <span style={sidebarCSS.spanFilterSelectors}></span> }
               </li>

               <li>
                  <span style={sidebarCSS.aFilterSelectors} onClick = { event => this.filterItems('downloaded') }>Downloaded</span>
                  { filterValue === 'downloaded' && <span style={sidebarCSS.spanFilterSelectors}></span> }
               </li>
            </ul>
         </nav>
      )
   }

   generateBody(cards) {
      let style = sidebarCSS.ulCard;
      style.maxHeight = this.state.height - 160;

      return (
         <ul style={style}>
            { cards }
         </ul>
      )
   }


   generateListElements(index, item) {
      let statusBar;

      switch (item.status) {
         case 'requested':
            // Yellow
            statusBar = { background: 'linear-gradient(to right, rgb(63, 195, 243) 0, rgb(63, 195, 243) 4px, #fff 4px, #fff 100%) no-repeat' }
            break;
         case 'downloading':
            // Blue
            statusBar = { background: 'linear-gradient(to right, rgb(255, 225, 77) 0, rgb(255, 225, 77) 4px, #fff 4px, #fff 100%) no-repeat' }
            break;
         case 'downloaded':
            // Green
            statusBar = { background: 'linear-gradient(to right, #39aa56 0, #39aa56 4px, #fff 4px, #fff 100%) no-repeat' }
            break;
         default:
            statusBar = { background: 'linear-gradient(to right, grey 0, grey 4px, #fff 4px, #fff 100%) no-repeat' }
      }

      statusBar.listStyleType = 'none';

      return (
         <Link style={sidebarCSS.link} to={{ pathname: '/admin/'+String(index)}} key={index}>
            <li style={statusBar}>
               <Interactive 
                  as='div'
                  style={ (index != this.state.listItemSelected) ? sidebarCSS.card : sidebarCSS.cardSelected }
                  hover={sidebarCSS.cardSelected}
                  focus={sidebarCSS.cardSelected}
                  active={sidebarCSS.cardSelected}>

                  <h2 style={sidebarCSS.titleCard}>
                     <span>{ item.name }</span>
                  </h2>

                  <p style={sidebarCSS.pCard}>
                     <span>Requested:
                        <time>
                        &nbsp;{ this.convertDateToDaysSince(item.requested_date) }
                        </time>
                     </span>
                  </p>
               </Interactive>
            </li>
         </Link>
      )
   }

   // This is our main loader that gets called when we receive api response through props from parent
   displayRequestedElementsInfo(requested_objects) {
      let requestedElement = requested_objects.map((item, index) => {
         if (['requested', 'downloading', 'downloaded'].indexOf(this.state.filterValue) != -1) {
            if (item.status === this.state.filterValue){
               return this.generateListElements(index, item);  
            }
         }
         else if (this.state.filterQuery !== '') {
            if (item.name.toLowerCase().indexOf(this.state.filterQuery.toLowerCase()) != -1)
               return this.generateListElements(index, item);
         }
         else
            return this.generateListElements(index, item);
      })

      this.setState({
         requestItemsToBeDisplayed: this.generateBody(requestedElement)
      })
   }

   render() {
      // if (typeof InstallTrigger !== 'undefined')
      //    bodyCSS.width = '-moz-min-content';

      return (
         <div>
            <h1 style={sidebarCSS.header}>Requested items</h1>
            { this.generateFilterSearch() }
            { this.generateNav() }

            <div key='requestedTable' style={sidebarCSS.body}>
               { this.state.requestItemsToBeDisplayed }
            </div>
         </div>
      );
   }
}

export default SidebarComponent;