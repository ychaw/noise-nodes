import React, { Component } from 'react';
import './style/colors.css';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Workspace from './Workspace'

class App extends Component {
  constructor(props) {
    super(props);
    this.id = "App";
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Workspace />
        <Footer />
      </div>
    );
  }
}

export default App;
