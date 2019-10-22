import React from 'react';
import '../style/colors.css';
import '../style/Connector.css';

class Connector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      isConnected: false,
    }
  }

  handleClick = () => {
    this.setState(state => ({
      isConnected: !state.isConnected
    }));
  }

  render() {
    return <button id='connector-button' onClick={this.handleClick}>{this.state.isConnected ? "I'm connected." : "Connect me!"}</button>
  }
}

export default Connector;
