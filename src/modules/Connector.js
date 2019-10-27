import React from 'react';
import '../style/Connector.css';

class Connector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    }
  }

  render() {
    const {id, type} = this.props;
    return <button id='connector-button' onClick={this.props.changeConnection.bind(this, id)}>{type}</button>
  }
}

export default Connector;
