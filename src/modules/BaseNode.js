import React from 'react';
import Connector from './Connector';
import '../style/BaseNode.css';

class BaseNode extends React.Component {

  constructor(props, inputs, outputs) {
      super(props);
      this.numberOfInputs = inputs;
      this.numberOfOutputs = outputs;
      this.state = {
        type: "base",
      }
  }

  updateGraph() {
    return;
  }

  delete() {
    return;
  }

  render() {
    return (
      <div className='BaseNode'>
        <h1>This is a Node!</h1>
        <p>It's type is {this.state.type}.</p>
        <p>It's inputs are {this.state.inputs}.</p><Connector type='input'/>
        <p>It's outputs are {this.state.outputs}.</p><Connector type='output'/>
      </div>
    );
  }
}

export default BaseNode;
