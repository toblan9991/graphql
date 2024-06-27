// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PersonShowPage from './pages/PersonShowPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/people/:id" component={PersonShowPage} />
      </Switch>
    </Router>
  );
}

export default App;




