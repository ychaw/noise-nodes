import React, { Component } from 'react';
import './style/colors.css';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Workspace from './Workspace'
import BaseNode from './modules/BaseNode';

class App extends Component {
  constructor(props) {
    super(props);
    this.id = "App";
    this.audioContext = new AudioContext();
    this.state = {
      firstSelected: undefined,
      secondSelected: undefined,
    };
  }

  changeConnection = (id) => {
    const {firstSelected, secondSelected} = this.state;

    if(!firstSelected) {
      this.setState({firstSelected: id}, () => {
        if(this.state.secondSelected !== undefined) {
          alert('Connecting ' + this.state.firstSelected + ' to ' + this.state.secondSelected);
          this.setState({firstSelected: undefined, secondSelected: undefined});
        }
      });
    } else if (!secondSelected) {
      this.setState({secondSelected: id}, () => {
        if(this.state.firstSelected !== undefined) {
          alert('Connecting ' + this.state.firstSelected + ' to ' + this.state.secondSelected);
          this.setState({firstSelected: undefined, secondSelected: undefined});
        }
      });
    }
  }

  render() {

    return (
      <div className="App">
        <Header />
        <span>Selected: {this.state.firstSelected + ' ' + this.state.secondSelected}</span>
        <Workspace>
          <BaseNode audioContext={this.audioContext} changeConnection={this.changeConnection}/>
          <BaseNode audioContext={this.audioContext} changeConnection={this.changeConnection}/>
        </Workspace>
        <Footer />
      </div>
    );
  }
}

export default App;
