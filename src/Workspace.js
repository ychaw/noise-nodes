import React from 'react';
import './style/Workspace.css';
import BaseNode from './modules/BaseNode';
import OutputNode from './modules/OutputNode';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    let nodes = [],
        selection = [null, null];
    this.state = {
      audioContext: new AudioContext(),
      nodes,
      selection,
    };
  }

  getNextFreeId = (type) => {
    let sameTypeNodes = this.state.nodes.filter((element) => {return element.type.name === 'BaseNode'});
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
                      changeConnection={this.changeConnection}
                      deleteNode={this.deleteNode}
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

  //helper for changeConnection to reduce complexity
  getUpdatedSelection = (index, id) => {
    let updatedSelection = [...this.state.selection];
    updatedSelection[index] = id;
    return updatedSelection;
  }

  makeConnection = () => {
    //alert('Connecting ' + this.state.selection[0] + ' to ' + this.state.selection[1]);
    const first = this.state.selection[0],
          second = this.state.selection[1];

    //make sure no same type connections can be made
    if (first.type !== second.type) {
      //connect output to input
      if(first.type === 'output') {
        first.audioNode.connect(second.audioNode);
      } else {
        second.audioNode.connect(first.audioNode);
      }
    } else {
      alert('I can only connect inputs and outputs');
    }
    this.setState({selection: [null, null]});
  }

  changeConnection = (id, type, audioNode) => {
    const params = {
      id: id,
      type: type,
      audioNode: audioNode
    };
    if(this.state.selection[0] === null) {
      this.setState({selection: this.getUpdatedSelection(0, params)}, () => {
        if(this.state.selection[1] !== null) {
          this.makeConnection();
        }
      });
    } else if (this.state.selection[1] === null) {
      this.setState({selection: this.getUpdatedSelection(1, params)}, () => {
        if(this.state.selection[0] !== null) {
          this.makeConnection();
        }
      });
    }
  }

  render() {
    // let {children} = this.props;
    // let nodes = [];
    // for(let count = 0; count < children.length; count++) {
    //   let child = children[count];
    //   let element = (<div id={'nodeContainer_'+child.props.id}>{child}</div>);
    //   nodes.push(element);
    // }
    return (
      <div className='workspace'>
        <button onClick={this.createNode.bind(this, 'BaseNode')}>Create BaseNode</button>
        {this.state.nodes}
        <OutputNode id={this.state.nodes.length} audioContext={this.state.audioContext} changeConnection={this.changeConnection}/>
      </div>
    );
  }
}

export default Workspace;
