import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.global.css';
import Main from './pages/Main';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact strict path="/" component={Main} />
        <Route path="" component={Settings} />
      </Switch>
    </Router>
  );
}
