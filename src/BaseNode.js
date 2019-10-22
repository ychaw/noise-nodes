import React from 'react';

class BaseNode extends React.Component {

  constructor(props, inputs, outputs) {
      super(props);
      this.numberOfInputs = inputs;
      this.numberOfOutputs = outputs;
      this.state = {
        type: "base",
      }
  }

  connectTo(targetNode) {
    return;
  }

  disconnectFrom(targetNode) {
    return;
  }

  updateGraph() {
    return;
  }

  delete() {
    return;
  }

  render() {
    return (
      <div>
        <h1>This is a Node!</h1>
        <p>It's type is {this.state.type}.</p>
        <p>It's inputs are {this.state.inputs}.</p>
        <p>It's outputs are {this.state.outputs}.</p>
      </div>
    );
  }
}

export default BaseNode;
