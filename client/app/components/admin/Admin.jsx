/*
	./app/components/App.jsx
	
	<FetchData url={"https://apollo.kevinmidboe.com/api/v1/plex/playing"} />
*/
import React from 'react';
import { HashRouter as Router, Route, Switch, IndexRoute } from 'react-router-dom';

import LoginForm from './LoginForm/LoginForm.jsx';
import { Provider } from 'react-redux';
import store from '../redux/store.jsx';

import { getCookie } from '../Cookie.jsx';
import { fetchJSON } from '../http.jsx'; 

import Sidebar from './Sidebar.jsx';
import AdminRequestInfo from './AdminRequestInfo.jsx';


class AdminComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			requested_objects: '',
		}
	}

	componentWillMount() {
		fetchJSON('https://apollo.kevinmidboe.com/api/v1/plex/requests/all', 'GET')
		.then(result => {
			this.setState({
				requested_objects: result.requestedItems
			})
		})
	}

	verifyLoggedIn() {
		let adminComponentStyle = {
			sidebar: {
				float: 'left',
			},
			selectedObjectPanel: {
				float: 'left',
			}
		}

		const logged_in = getCookie('logged_in');
		if (!logged_in) {
			return <LoginForm />
		}

		let display = undefined
		if (this.props.match.params.search && this.state.requested_objects !== '') {
			display = this.state.requested_objects[this.props.match.params.search]
		}

		return (
			<div>
				<div style={adminComponentStyle.sidebar}>
					<Sidebar requested_objects={this.state.requested_objects} style={adminComponentStyle.sidebar}/>
				</div>
				<div style={adminComponentStyle.selectedObjectPanel}>
					<AdminRequestInfo display={display} />
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