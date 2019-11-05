import React from 'react';
import Connector from './Connector';
import Setting from './Setting';

class GainNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'GainNode' + this.props.id;
      this.dsp = {
        gain: this.props.audioContext.createGain(),
      }
      this.state = {
        gain: 0.5,
      }
  }

  changeGain = (e) => {
    const {gain} = this.dsp;
    const newValue = e.target.value;
    this.setState({gain: newValue}, ()=> {
      gain.gain.value = newValue;
    });
  }

  render() {
    return (
      <div style={style}className='GainNode'>
        <h1>{this.name}</h1>
        <Setting name='Gain' unit='' changeValue={this.changeGain} min='0' max='1' step='0.1' value={this.state.gain} />
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.gain} changeConnection={this.props.changeConnection}/>
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.gain} changeConnection={this.props.changeConnection}/>
        <button onClick={this.props.deleteNode.bind(this, this.name)}>[X]</button>
      </div>
    );
  }
}

const style = {
  width:'200px',
  height:'350px',
  float: 'left',
  backgroundColor: 'var(--secondary1-shade0)',
  padding: '16px',
  border: '8px solid',
  borderColor: 'var(--secondary1-shade3)',
}

export default GainNode;
