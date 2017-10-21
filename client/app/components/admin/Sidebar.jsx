import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarComponent extends Component {  

	generateListElements(index, item) {
		if (index == this.props.listItemSelected)
			return (
				<td>{item.name}</td>
			)
		else
			return (
				<td><Link to={{ pathname: '/admin/'+String(index)}}>{item.name}</Link></td>
			)
	}

	displayRequestedElementsInfo() {
		if (this.props.requested_objects) {
			let requestedElement = this.props.requested_objects.map((item, index) => {
				return (
					<tr key={index}>
						{ this.generateListElements(index, item) }
						<td>{item.status}</td>
						<td>{item.requested_date}</td>
					</tr>
				)
			})

			return (
				<table key='requestedTable'>
					<thead>
						<tr>
							<th><b>Name</b></th>
							<th><b>Status</b></th>
							<th><b>Date</b></th>
						</tr>
					</thead>
					<tbody>
						{requestedElement}
					</tbody>
				</table>
				)
		}
	}

  render() {
  	console.log('sidebar: ', this.props.requested_objects)
    return (
    	<div>
	      <h1>Hello from the sidebar: </h1>
	      <span>{ this.displayRequestedElementsInfo() }</span>
	     </div>
    );
  }
}

export default SidebarComponent;