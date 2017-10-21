import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, IndexRoute } from 'react-router-dom';

import SearchRequest from './components/SearchRequest.jsx';
import AdminComponent from './components/admin/Admin.jsx';

class Root extends Component {

  // We need to provide a list of routes
  // for our app, and in this case we are
  // doing so from a Root component
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={SearchRequest} />
          <Route path='/admin/:request' component={AdminComponent} />
          <Route path='/admin' component={AdminComponent} />
        </Switch>
    </Router>
    );
  }
}

export default Root;