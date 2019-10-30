import React from 'react';
import './style/Workspace.css';
import BaseNode from './modules/BaseNode';

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

  createNode = () => {
      let node = (<BaseNode id={this.state.nodes.length} audioContext={this.state.audioContext} changeConnection={this.changeConnection} deleteNode={this.deleteNode}/>);
      this.setState({
        nodes: [...this.state.nodes, node],
      });
  }

  deleteNode = (id) => {
    let updatedNodes = this.state.nodes.filter((node) => {
      return node.props.id !== id;
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
    alert('Connecting ' + this.state.selection[0] + ' to ' + this.state.selection[1]);
    this.setState({selection: [null, null]});
  }

  changeConnection = (id, type, audioNode) => {
    if(this.state.selection[0] === null) {
      this.setState({selection: this.getUpdatedSelection(0, id)}, () => {
        if(this.state.selection[1] !== null) {
          this.makeConnection();
        }
      });
    } else if (this.state.selection[1] === null) {
      this.setState({selection: this.getUpdatedSelection(1, id)}, () => {
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
        <button onClick={this.createNode}>Create node</button>
        {this.state.nodes}
      </div>
    );
  }
}

export default Workspace;
