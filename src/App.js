import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing/index';
import CreateMeeting from './pages/CreateMeeting';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/perfectmeeting">
            <Landing />
          </Route>
          <Route exact path="/createmeeting">
            <CreateMeeting />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
