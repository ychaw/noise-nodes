import React, { Component } from 'react';
import './style/colors.css';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BaseNode from './modules/BaseNode';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <BaseNode />
        <Footer />
      </div>
    );
  }
}

export default App;
