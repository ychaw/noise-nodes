import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import Param from './Param';

class GainNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'GainNode' + this.props.id;
      this.dsp = {
        gain: this.props.audioContext.createGain(),
      }
      this.state = {
        gain: new Param('gain', 0.5, 0, 1),
      }
      this.inputs = [this.dsp.gain];
      this.outputs = [this.dsp.gain];
  }

  componentDidMount() {
    this.dsp.gain.gain.value = this.state.gain.absValue;
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  changeValue = (e, target, param) => {
    const relValue = e.target.value;
    let newObj = this.state[param.tag];
    newObj.relValue = relValue;
    this.setState({[param.tag]: newObj}, ()=> {
      target.value = this.state[param.tag].absValue;
    });
  }

  render() {
    return (
      <div style={style}className='GainNode'>
        <h1 style={topStyle}>GAIN</h1>
        <Setting name='Gain' unit='' changeValue={this.changeValue} target={this.dsp.gain.gain} value={this.state.gain} />
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.gain} select={this.props.select}/>
        <button onClick={this.props.deleteNode.bind(this, this.name)}>[X]</button>
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.gain} select={this.props.select}/>
      </div>
    );
  }
}

const style = {
  width:'200px',
  height:'200px',
  float: 'left',
  backgroundColor: 'var(--secondary1-shade0)',
}

const topStyle = {
  display: 'flex',
  width: '100%',
  height: '64px',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  margin: '0px',
  padding: '0px',
  backgroundColor: 'var(--secondary1-shade3)',
}

export default GainNode;
