import React from 'react';

class Connector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    }
  }

  render() {
    const {id, type, audioNode} = this.props;
    return <button style={style} id='connector-button' onClick={this.props.select.bind(this, id, type, audioNode)}>{type}</button>
  }
}

const style = {
  padding: '0.7rem',
  borderRadius: '100%',
}

export default Connector;
