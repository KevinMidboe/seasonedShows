import React from 'react';

import { getCookie } from './Cookie.jsx';

// class http {
// 	dispatch(obj) {
// 		console.log(obj);
// 	}

	function checkStatus(response) {
	  const hasError = (response.status < 200 || response.status >= 300)
	  if (hasError) {
	    throw response.text();
	  }
	  return response;
	}

	function parseJSON(response) { return response.json(); }

	

// 	*
// 	* Retrieve search results from tmdb with added seasoned information.
// 	* @param {String} uri query you want to search for
// 	* @param {Number} page representing pagination of results
// 	* @returns {Promise} succeeds if results were found
	
// 	fetchSearch(uri) {
// 		fetch(uri, {
// 			method: 'GET',
// 			headers: {
// 				'authorization': getCookie('token')
// 			},
// 		})
// 		.then(response => {

// 		});
// 	}
// }

// export default http;

export function fetchJSON(url, method, data) {
	return fetch(url, {
		method: method,
		headers: new Headers({
		  'Content-Type': 'application/json',
		  'authorization': getCookie('token'),
		}),
		body: JSON.stringify(data)
	}).then(checkStatus).then(parseJSON);
}