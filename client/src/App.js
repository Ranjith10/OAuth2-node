import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import OAuth from './authentication/OAuth'
import Register from './authentication/Register'
import Login from './authentication/Login' 
import './App.css';

const App = () => {
  return (
    <Router>
        <div className="App">
            <OAuth 
            />
            <Route path = '/' render =  {() => <Redirect to = '/login' />} />
            <Route path = '/register' render = {() => 
                <>
                    <Register />
                </>
                }
            />
            <Route path = '/login' render = {() => 
                <>
                    <Login />
                </>
                } 
            />
        </div>
    </Router>
  );
}

export default App;
