import React from 'react';
import '../style/Connector.css';

class Connector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      isConnected: false,
      connectedTo: undefined,
    }
  }

  handleClick = () => {
    this.setState(state => ({
      isConnected: !state.isConnected
    }));
  }

  connectTo(targetNode) {
    return;
  }

  disconnectFrom(targetNode) {
    return;
  }

  render() {
    return <button id='connector-button' onClick={this.handleClick}>{this.state.type}</button>
  }
}

export default Connector;
