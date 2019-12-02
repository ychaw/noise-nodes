import React from 'react';
import Pallet from './components/Pallet';
import BaseNode from './modules/BaseNode';
import OscNode from './modules/OscNode';
import OutputNode from './modules/OutputNode';
import GainNode from './modules/GainNode';
import FilterNode from './modules/FilterNode';
import LFONode from './modules/LFONode';
import EnvelopeNode from './modules/EnvelopeNode';
import SequencerNode from './modules/SequencerNode';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    let nodes = [],
        selection = [null, null],
        existingConnections = [];
    this.state = {
      audioContext: new AudioContext(),
      nodes,
      selection,
      existingConnections,
    };
  }

  getNextFreeId = (type) => {
    let sameTypeNodes = this.state.nodes.filter((element) => {return element.type.name === type});
    sameTypeNodes.sort((a, b) => a.props.id - b.props.id)
    // check for holes in the array and try to fill them
    for (var i = 0; i < sameTypeNodes.length; i++) {
      if(sameTypeNodes[i].props.id > i) {
        // if the hole is on index 0, just add a node with id 0
        if (i === 0) {
          return 0;
        } else {
          return sameTypeNodes[i-1].props.id + 1; //if the hole is somewhere in the middle, place new element after last correctly placed element
        }
      }
    }
    //no holes found; the new element should be placed at the end
    return sameTypeNodes.length;
  }

  createNode = (type) => {
    let id = this.getNextFreeId(type),
        newNode;
    switch (type) {
      case 'BaseNode':
        newNode = (<BaseNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      case 'OscNode':
        newNode = (<OscNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      case 'GainNode':
        newNode = (<GainNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      case 'FilterNode':
        newNode = (<FilterNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      case 'LFONode':
        newNode = (<LFONode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      case 'EnvelopeNode':
        newNode = (<EnvelopeNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      case 'SequencerNode':
        newNode = (<SequencerNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                  />);
        break;
      default:

    }
    this.setState({
      nodes: [...this.state.nodes, newNode],
    });
  }

  deleteNode = (name) => {
    let updatedNodes = this.state.nodes.filter((node) => {
      return node.type.name + node.props.id !== name;
    });
    this.setState({
      nodes: [...updatedNodes],
    });
  }

  //helper for select to reduce complexity
  getUpdatedSelection = (index, info) => {
    let updatedSelection = [...this.state.selection];
    updatedSelection[index] = info;
    return updatedSelection;
  }

  storeConnection = (output, input) => {
    this.setState({
      existingConnections: [...this.state.existingConnections, {output: output, input: input}]
    });
  }

  removeStoredConnection = (output, input) => {
    let updatedConnections = this.state.existingConnections.filter((existingConnection) => {
      return (existingConnection.output !== output) && (existingConnection.input !== input);
    });
    this.setState({
      existingConnections: [...updatedConnections]
    });
  }

  connectionExists = (output, input) => {
    //get the same connections
    let sameConnections = this.state.existingConnections.filter((existingConnection) => {
      return (existingConnection.output === output) && (existingConnection.input === input);
    });
    //if there are any, return true
    return sameConnections.length > 0;
  }

  // this function assumes that the selection would make a valid connection
  sortSelection = () => {
    const first = this.state.selection[0],
          second = this.state.selection[1];

    let input = (first.type === 'audio-input' || first.type === 'control-input') ? first : second;
    let output = (first.type === 'audio-output' || first.type === 'control-output') ? first : second;

    return {
      input: input,
      output: output,
    }
  }

  isSelectionValidConnection = () => {
    const first = this.state.selection[0],
          second = this.state.selection[1];

    let isValid = (
        (first.type === 'control-output' && second.type === 'control-input') ||
        (first.type === 'control-input' && second.type === 'control-output') ||
        (first.type === 'audio-output' && second.type === 'audio-input') ||
        (first.type === 'audio-input' && second.type === 'audio-output')
      )
    return isValid;
  }

  toggleConnection = () => {
    if(this.isSelectionValidConnection()) {
      const {input, output} = this.sortSelection();
      if(this.connectionExists(output, input)) {
        output.audioNode.disconnect(input.audioNode);
        this.removeStoredConnection(output.audioNode, input.audioNode);
      } else {
        output.audioNode.connect(input.audioNode);
        this.storeConnection(output.audioNode, input.audioNode);
      }
    } else {
      alert("I can only connect an input with an output of the same type.");
    }
  }

  select = (id, type, audioNode) => {
    let updatedSelection = [...this.state.selection];

    // if bugs with selection occur, check here
    updatedSelection.some((value, index, _updatedSelection) => {
      if(value === null) updatedSelection[index] = {
        id: id,
        type: type,
        audioNode: audioNode
      };
      return value === null;
    });

    this.setState({selection: updatedSelection}, () => {
      if(this.state.selection[0] !== null && this.state.selection[1] !== null) {
        this.toggleConnection();
        this.setState({selection: [null, null]});
      }
    });
  }

  createNodeHandlers = {
    'OSC': this.createNode.bind(this, 'OscNode'),
    'GAIN': this.createNode.bind(this, 'GainNode'),
    'FILTER': this.createNode.bind(this, 'FilterNode'),
    'LFO': this.createNode.bind(this, 'LFONode'),
    'ENV': this.createNode.bind(this, 'EnvelopeNode'),
    'SEQ': this.createNode.bind(this, 'SequencerNode'),
  };

  cleanUp = (inputs, outputs) => {
    console.log("existingConnections at cleanUp start", this.state.existingConnections);
    // clean up inputs
    for (let input of inputs) {
      // get all connections with this input
      let connections = this.state.existingConnections.filter((existingConnection) => {
        return (existingConnection.input === input);
      });
      // disconnect them
      for (let connection of connections) {
        connection.output.disconnect(connection.input);
        this.removeStoredConnection(connection.output, connection.input);
      }
    }

    //clean up outputs
    for (let output of outputs) {
      // get all connections with this output
      let connections = this.state.existingConnections.filter((existingConnection) => {
        return (existingConnection.output === output);
      });
      // disconnect them
      for (let connection of connections) {
        connection.output.disconnect(connection.input);
        this.removeStoredConnection(connection.output, connection.input);
      }
    }

    console.log("existingConnections at cleanUp end", this.state.existingConnections);
  }

  render() {
    return (
      <div style={style} className='workspace'>
        <Pallet createNodeHandlers={this.createNodeHandlers}/>
        {this.state.nodes}
        <OutputNode id={this.state.nodes.length} audioContext={this.state.audioContext} select={this.select}/>
      </div>
    );
  }
}

const style = {
  width: 'auto',
  height: '600px',
  backgroundColor: 'var(--primary-shade0)',
}

export default Workspace;
