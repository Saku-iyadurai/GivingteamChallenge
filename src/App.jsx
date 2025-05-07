import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import TeamManagement from './components/TeamManagement';
import TeamContribution from './components/TeamContribution';
import Leaderboard from './components/Leaderboard';
import './styles/App.css';

// This is the main App component that sets up the routing for the application.
// It uses React Router to define different routes for managing teams, contributing to teams, and viewing the leaderboard.
// The component imports necessary modules and components, including TeamManagement, TeamContribution, and Leaderboard.
// The component also includes a navigation menu with links to different sections of the application.
const App = () => {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/teams">Manage Teams</Link></li>
                        <li><Link to="/contribute">Contribute to Teams</Link></li>
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/" exact>
                        <h1>Welcome to the Giving Teams Challenge</h1>
                    </Route>
                    <Route path="/teams" component={TeamManagement} />
                    <Route path="/contribute" component={TeamContribution} />
                    <Route path="/leaderboard" component={Leaderboard} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;