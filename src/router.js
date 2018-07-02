import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Category from './routes/Category';
import TopicDetails from './routes/TopicDetails';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Category} />
        <Route path="/details" exact component={TopicDetails} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
