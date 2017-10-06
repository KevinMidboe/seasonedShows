/*
	./app/components/App.jsx
	
	<FetchData url={"https://apollo.kevinmidboe.com/api/v1/plex/playing"} />
*/
import React from 'react';
import { Link } from 'react-router-dom'

import FetchData from './FetchData.js';
import ListStrays from './ListStrays.jsx';

import FetchRequested from './FetchRequested.jsx';

import LoginForm from './LoginForm/LoginForm.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.jsx';

import { getCookie } from './Cookie.jsx';


function getLoginStatus() {
	const logged_in = getCookie('logged_in');
	if (logged_in) {
		return <FetchRequested />
	}
	return <LoginForm />
}

const Admin = () => (
	<Provider store={store}>
		{ getLoginStatus() }
    </Provider>
)

export default Admin