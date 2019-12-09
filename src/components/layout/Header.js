import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaying: false,
      aboutText: 'About',
    }
  }

  displayAbout = () => {
    this.setState({
      displaying: !this.state.displaying,
      aboutText: this.state.displaying ? 'About' : 'Made by Ian Fennie & Yannick Clausen',
    });
  }

  render() {
    let aboutChangedStyle;
    if(this.state.displaying) {
      aboutChangedStyle = {fontSize: '10px', textAlign: 'center', padding:'auto'}
    } else {
      aboutChangedStyle = {};
    }
    return (
      <header style={headerStyle}>
        <div style={headerItemStyle}>
          <h1>NoiseNodes</h1>
        </div>
        <div style={{...headerItemStyle,...aboutStyle,...aboutChangedStyle}} onClick={this.displayAbout}>
          <h1>{this.state.aboutText}</h1>
        </div>
      </header>
    )
  }

}

const headerStyle = {
    position: 'fixed',
    width: '100%',
    height: '75px',
    top: '0px',
    left: '0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--primary-shade3)',
    border: '1px solid black',
    color: 'white',
}

const headerItemStyle = {
    height: '75px',
    flexBasis: '250px',
    background: 'var(--primary-shade4)',
    cursor: 'default',
}

const aboutStyle = {
    // alignSelf: 'stretch',
    // alignContent: 'center',
    // flexShrink: '1',
    cursor: 'pointer',
 }
