import React from 'react';
import Connector from './Connector';
import '../style/BaseNode.css';

class BaseNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'BaseNode';
  }

  delete() {
    return;
  }

  render() {
    return (
      <div className='BaseNode'>
        <h1>{this.name}</h1>
        <Connector type='input' id='input-1' changeConnection={this.props.changeConnection}/>
        <Connector type='output' id='output-1' changeConnection={this.props.changeConnection}/>
      </div>
    );
  }
}

export default BaseNode;
