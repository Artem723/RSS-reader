import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import EnterLink from '../../Conteiners/EnterLink';
import Feed from '../../Conteiners/Feed';


class App extends Component {
  render() {
    return (
      <div className="App container">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        
          <EnterLink />
          <Feed />
        
      </div>
    );
  }
}

export default App;
