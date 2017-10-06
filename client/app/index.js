/*
* @Author: KevinMidboe
* @Date:   2017-06-01 21:08:55
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-05 13:47:37

    ./client/index.js
    which is the webpack entry file
*/

import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './components/App.jsx';

render((
	<HashRouter>
		<App />
	</HashRouter>
), document.getElementById('root'));