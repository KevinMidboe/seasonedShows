import React from 'react';
import { HashRouter as Router, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import SearchRequest from './SearchRequest.jsx';
import Admin from './Admin.jsx';
import NotFound from './NotFound.js';

export const history = createBrowserHistory();

const Main = () => (
	<Router>
		<Switch>
			<Route exact path='/' component={SearchRequest} />
			<Route path='/admin' component={Admin} />
			<Route component={NotFound} />
		</Switch>
	</Router>
)

export default Main
