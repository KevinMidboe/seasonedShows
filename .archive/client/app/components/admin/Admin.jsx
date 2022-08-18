
import React from 'react';

import LoginForm from './LoginForm/LoginForm.jsx';
import { Provider } from 'react-redux';
import store from '../redux/store.jsx';

import { getCookie } from '../Cookie.jsx';
import { fetchJSON } from '../http.jsx'; 

import Sidebar from './Sidebar.jsx';
import AdminRequestInfo from './AdminRequestInfo.jsx';

import adminCSS from '../styles/adminComponent.jsx'


class AdminComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			requested_objects: '',
		}

		this.updateHandler = this.updateHandler.bind(this)
	}

	// Fetches all requested elements and updates the state with response
	componentWillMount() {
		this.fetchRequestedItems()
	}

	fetchRequestedItems() {
		fetchJSON('https://apollo.kevinmidboe.com/api/v1/plex/requests/all', 'GET')
		.then(result => {
			this.setState({
				requested_objects: result.results.reverse()
			})
		})
	}

	updateHandler() {
		this.fetchRequestedItems()
  	}

	// Displays loginform if not logged in and passes response from 
	// api call to sidebar and infoPanel through props
	verifyLoggedIn() {
		const logged_in = getCookie('logged_in');
		if (!logged_in) {
			return <LoginForm />
		}

		let selectedRequest = undefined;
		let listItemSelected = undefined;
		
		const requestParam = this.props.match.params.request;

		if (requestParam && this.state.requested_objects !== '') {
			selectedRequest = this.state.requested_objects[requestParam]
			listItemSelected = requestParam;
		}

		return (
			<div>
				<div style={adminCSS.selectedObjectPanel}>
					<AdminRequestInfo 
						selectedRequest={selectedRequest}
						listItemSelected={listItemSelected}
						updateHandler = {this.updateHandler} 
					 />
				</div>
				<div style={adminCSS.sidebar}>
					<Sidebar 
						requested_objects={this.state.requested_objects} 
						listItemSelected={listItemSelected}
						/>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Provider store={store}>
				{ this.verifyLoggedIn() }
	    	</Provider>
	    )
    }

}

export default AdminComponent;
