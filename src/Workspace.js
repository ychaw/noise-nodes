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
import FMNode from './modules/FMNode';
import LineTo from 'react-lineto';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    let nodes = [],
        selection = [null, null],
        existingConnections = [],
        lineComponents = [];
    this.state = {
      audioContext: new AudioContext(),
      nodes,
      selection,
      existingConnections,
      lineComponents,
    }
    this.readoutState = {
      timer: null,
      fadeTime: 2000,
      text: '',
      hidden: true,
    }
  }

  getNextFreeId = (type) => {
    let sameTypeNodes =
        this.state.nodes.filter((element) => {
          return element.type.name === type;
        });
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

  getSelection = () => this.state.selection;

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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
                  />);
        break;
      case 'FMNode':
        newNode = (<FMNode
                    id={id}
                    key={type + '_' + id}
                    audioContext={this.state.audioContext}
                    select={this.select}
                    deleteNode={this.deleteNode}
                    cleanUp={this.cleanUp}
                    getSelection={this.getSelection}
                    rebuildLineComponents={this.rebuildLineComponents.bind(this)}
                    readout={this.readout}
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
    let type;
    if ((output.type === "audio-output") && (input.type === "audio-input")) {
      type = "audio";
    } else if (
        (output.type === "control-output") &&
            (input.type === "control-input")
    ) {
      type = "control";
    }
    const connection = {type: type, output: output, input: input};
    const lineComponent = this.buildLineComponentFromConnection(connection);

    this.setState({
      existingConnections: [...this.state.existingConnections, connection],
      lineComponents: [...this.state.lineComponents, lineComponent],
    });
  }

  removeStoredConnection = (output, input) => {
    const updatedConnections =
        this.state.existingConnections.filter((existingConnection) => {
          return (existingConnection.output.id !== output.id) ||
              (existingConnection.input.id !== input.id);
        });

    const lineComponents =
        this.state.lineComponents.filter((lineComponent) => {
            return (lineComponent.props.from !== output.id) ||
                (lineComponent.props.to !== input.id);
        });

    this.setState({
      existingConnections: [...updatedConnections],
      lineComponents : [...lineComponents],
    });
  }

  connectionExists = (output, input) => {
    //get the same connections
    let sameConnections =
        this.state.existingConnections.filter((existingConnection) => {
          return (existingConnection.output.id === output.id) &&
              (existingConnection.input.id === input.id);
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
          second = this.state.selection[1],
          firstNodeName = first.id.slice(0, first.id.indexOf('_')),
          secondNodeName = second.id.slice(0, second.id.indexOf('_'));
    let isValid = (
        (first.type === 'control-output' && second.type === 'control-input') ||
        (first.type === 'control-input' && second.type === 'control-output') ||
        (first.type === 'audio-output' && second.type === 'audio-input') ||
        (first.type === 'audio-input' && second.type === 'audio-output')
      ) && (firstNodeName !== secondNodeName);
    return isValid;
  }

  toggleConnection = () => {
    if(this.isSelectionValidConnection()) {
      const {input, output} = this.sortSelection();
      if (this.connectionExists(output, input)) {
        output.audioNode.disconnect(input.audioNode);
        this.removeStoredConnection(output, input);
      } else {
        output.audioNode.connect(input.audioNode);
        this.storeConnection(output, input);
      }
    } else {
      alert("I can't make that connection. Only connections with an input and an output of the same type between different nodes are allowed.");
    }
  }

  select = (id, type, audioNode) => {
    let updatedSelection = [...this.state.selection];

    // if bugs with selection occur, check here
    updatedSelection.some((value, index, _updatedSelection) => {
      if (value === null) {
        updatedSelection[index] = { id: id, type: type, audioNode: audioNode };
      }
      return value === null;
    });

    this.setState({selection: updatedSelection}, () => {
      if(this.state.selection[0] !== null && this.state.selection[1] !== null) {
        this.toggleConnection();
        this.setState({selection: [null, null]});
      }
    });

  }

  getConnectionColor(connection) {
    let color;
      switch (connection.type) {
        case 'audio': {
          color = 'var(--secondary1-shade3)';
          break;
        }
        case 'control': {
          color = 'var(--secondary2-shade3)';
          break;
        }
        default: {
          color = 'red';
        }
      }
    return color;
  }

  buildLineComponentFromConnection(connection) {
    const lineComponent =
        (<LineTo
            className='line'
            from={connection.output.id}
            to={connection.input.id}
            borderColor={this.getConnectionColor(connection)}
            key={connection.output.id + '_' + connection.input.id}
            {...lineStyle}
        />);
      return lineComponent;
  }

  rebuildLineComponents = function() {
    this.setState({lineComponents: []});

    let lineComponents = [];

    for (const connection of this.state.existingConnections) {
      const lineComponent = this.buildLineComponentFromConnection(connection);
      lineComponents = [...lineComponents, lineComponent];
    }

    this.setState({lineComponents: lineComponents});
  }

  createNodeHandlers = {
    'OSC': this.createNode.bind(this, 'OscNode'),
    'GAIN': this.createNode.bind(this, 'GainNode'),
    'FILTER': this.createNode.bind(this, 'FilterNode'),
    'LFO': this.createNode.bind(this, 'LFONode'),
    'ENV': this.createNode.bind(this, 'EnvelopeNode'),
    'SEQ': this.createNode.bind(this, 'SequencerNode'),
    'FM': this.createNode.bind(this, 'FMNode'),
  };

  cleanUp = (nodeName) => {
    for (const connection of this.state.existingConnections) {
      if (
          connection.input.id.startsWith(nodeName) ||
              connection.output.id.startsWith(nodeName)
      ) {
        connection.output.audioNode.disconnect(connection.input.audioNode);
      }
    }

    const nextConnections =
        this.state.existingConnections.filter(
            (connection) => {
              return (
                  !(connection.output.id.startsWith(nodeName) ||
                      connection.input.id.startsWith(nodeName))
              );
            }
        );

    const nextLineComponents =
        this.state.lineComponents.filter(
            (lineComponent) => {
              return (
                  !(lineComponent.props.from.startsWith(nodeName) ||
                      lineComponent.props.to.startsWith(nodeName))
              )
            }
        );

    this.setState({
      existingConnections: nextConnections,
      lineComponents: nextLineComponents
    });
  }

  readout = (name, value) => {
    clearTimeout(this.readoutState.timer);
    this.readoutState.text = name.concat(': ', Number(value.absValue).toPrecision(2));
    this.readoutState.hidden = false;

    this.readoutState.timer = setTimeout(()=>{
      this.readoutState.text = '';
      this.readoutState.hidden = true;
      this.forceUpdate();
    }, this.readoutState.fadeTime);

    this.forceUpdate();
  }



  render() {
    let newReadoutStyle = {...readoutStyle, visibility: this.readoutState.hidden ? 'hidden' : 'visible'};
    return (
      <div
        className='workspace'
        style={style}
        onScroll={this.rebuildLineComponents.bind(this)}
        >
        <Pallet createNodeHandlers={this.createNodeHandlers} />
        {this.state.nodes}
        <OutputNode
          id={this.state.nodes.length}
          audioContext={this.state.audioContext}
          select={this.select}
          selection={this.state.selection}
          getSelection={this.getSelection}
          rebuildLineComponents={this.rebuildLineComponents.bind(this)}
          readout={this.readout}
        />
        {this.state.lineComponents}
        <div className='readout' style={newReadoutStyle}>
          {this.readoutState.text}
        </div>
      </div>
    );
  }
}

const style = {
  width: '100%',
  height: '100%',
  overflow: 'auto',
  zIndex: '-10',
  position: 'fixed',
  backgroundColor: 'var(--primary-shade1)'
}

const lineStyle = {
  borderStyle: 'solid',
  borderWidth: 5,
};

const readoutStyle = {
  position: 'fixed',
  padding: '0.5em 2em',
  bottom: '24px',
  right: '4px',
  color: '#fff',
  backgroundColor: 'var(--primary-shade2)',
}

export default Workspace;
