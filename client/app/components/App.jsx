/*
	./app/components/App.jsx
	
	<FetchData url={"https://apollo.kevinmidboe.com/api/v1/plex/playing"} />
*/
import React from 'react';
import FetchData from './FetchData.js';
import ListStrays from './ListStrays.jsx'
import SearchRequest from './SearchRequest.jsx';

export default class App extends React.Component {

				// <div>
				// 	<h1>Welcome to Seasoned</h1>
				// </div>
					// <ListStrays />

					// <FetchData />
	render() {
		return (
			<div>

					<SearchRequest />
			</div>
		);
	}
}