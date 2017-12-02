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
		}
	}

	// Where we wait for api response to be delivered from parent through props
	componentWillReceiveProps(props) {
		this.state.listItemSelected = props.listItemSelected;
		this.displayRequestedElementsInfo(props.requested_objects);
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

		this.setState({
			requestItemsToBeDisplayed: filteredByQuery,
			filterQuery: query,
		});
	}


	generateFilterDropdown() {
		return (
			<select onChange={ event => this.filterItems(event.target.value) } value={this.state.filterValue}>
				<option value='all'>All</option>
				<option value='requested'>Requested</option>
				<option value='downloading'>Downloading</option>
				<option value='downloaded'>Downloaded</option>
			</select> 
		)
	}

	generateFilterSearchbar() {
		return (
			<input
				type="text" 
				id="search" 
				placeholder="Filter by name..." 
	         onChange={event => this.updateFilterQuery(event)}
	         value={this.state.filterQuery}/>
		)
	}

	// A colored bar indicating the status of a item by color.
	generateRequestIndicator(status) {
		let statusColor;

		switch (status) {
			case 'requested':
				// Yellow
				statusColor = '#ffe14d';
				break;
			case 'downloading':
				// Blue
				statusColor = '#3fc3f3';
				break;
			case 'downloaded':
				// Green
				statusColor = '#6be682';
				break;
			default:
				statusColor = 'grey';
		}

		const indicatorCSS = {
			width: '100%',
			height: '4px',
			marginTop: '3px',
			backgroundColor: statusColor,
		}

		return (
			<div style={indicatorCSS}></div> 
		)
	}


	generateListElements(index, item) {
		if (index == this.state.listItemSelected) {
			return (
				<div style={sidebarCSS.parentElement_selected}>
					<div style={sidebarCSS.contentContainer}>
						<span style={sidebarCSS.title}> {item.name } </span>
						<div style={sidebarCSS.rightContainer}>
							<span>{ this.convertDateToDaysSince(item.requested_date) }</span>
						</div>
					</div>
					<span>Status: { item.status }</span>
					<br/>
					<span>Matches found: 0</span>
					{ this.generateRequestIndicator(item.status) }
				</div>
			)
		}
		else
		return (
			<Link style={sidebarCSS.link} to={{ pathname: '/admin/'+String(index)}}>
				<Interactive 
					key={index} 
					style={sidebarCSS.parentElement}
					as='div'
					hover={sidebarCSS.parentElement_hover}
					focus={sidebarCSS.parentElement_hover}
					active={sidebarCSS.parentElement_active}>

						<span style={sidebarCSS.title}> {item.name } </span>
						<div style={sidebarCSS.rightContainer}>
							<span>{ this.convertDateToDaysSince(item.requested_date) }</span>
						</div>
						<br/>
						{ this.generateRequestIndicator(item.status) }
				</Interactive>
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
			requestItemsToBeDisplayed: requestedElement,
		})
	}

	render() {
		let bodyCSS = sidebarCSS.body;
		if (typeof InstallTrigger !== 'undefined')
			bodyCSS.width = '-moz-min-content';

		return (
			<div>
				<h1>Hello from the sidebar: </h1>
				{ this.generateFilterDropdown() }
				{ this.generateFilterSearchbar() }
				<div key='requestedTable' style={bodyCSS}>
					{ this.state.requestItemsToBeDisplayed }
				</div>
			</div>
	   );
  	}
}

export default SidebarComponent;