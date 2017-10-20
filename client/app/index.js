/*
* @Author: KevinMidboe
* @Date:   2017-06-01 21:08:55
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-20 19:24:52

    ./client/index.js
    which is the webpack entry file
*/

import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Root from './Root.jsx';

render((
	<HashRouter>
		<Root />
	</HashRouter>
), document.getElementById('root'));