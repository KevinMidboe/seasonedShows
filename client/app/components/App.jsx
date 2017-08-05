/*
	./app/components/App.jsx
	
	<FetchData url={"https://apollo.kevinmidboe.com/api/v1/plex/playing"} />
*/
import React from 'react';
import FetchData from './FetchData.js';
import ListStrays from './ListStrays.jsx'
import SearchRequest from './SearchRequest.jsx';

import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Titillium Web:300,400,700', 'sans-serif']
  }
});
	var background = {
      backgroundColor: '#fafafa'
    }

export default class App extends React.Component {

	render() {
		return (
			<div style={background}>
				<div>
					<h1>Welcome to Seasoned</h1>
				</div>
					<ListStrays />

					<FetchData />

					<SearchRequest />
			</div>
		);
	}
}