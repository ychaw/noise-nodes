import React, { Component } from 'react';
import './style/colors.css';
import './App.css';
import Header from './components/layout/Header';
import BaseNode from './modules/BaseNode';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <BaseNode />
      </div>
    );
  }
}

export default App;
