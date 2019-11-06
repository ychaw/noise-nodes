import React from 'react';
import Connector from './Connector';
import Setting from './Setting';

class FilterNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'FilterNode' + this.props.id;
      this.dsp = {
        filter: this.props.audioContext.createBiquadFilter(),
      }
      this.state = {
        frequency: 2000,
        q: 0,
        type: 'lowpass',
      }
  }

  changeGain = (e) => {
    const {gain} = this.dsp;
    const newValue = e.target.value;
    this.setState({gain: newValue}, ()=> {
      gain.gain.value = newValue;
    });
  }

  changeFrequency = (e) => {
    const {filter} = this.dsp;
    const newValue = e.target.value;
    this.setState({frequency: newValue}, ()=> {
      filter.frequency.value = newValue;
    });
  }

  changeQ = (e) => {
    const {filter} = this.dsp;
    const newValue = e.target.value;
    this.setState({frequency: newValue}, ()=> {
      filter.q.value = newValue;
    });
  }

  render() {
    return (
      <div style={style}className='FilterNode'>
        <h1>{this.name}</h1>
        <Setting name='Frequency' unit='Hz' changeValue={this.changeFrequency} min='20' max='10000' step='1' value={this.state.frequency} />
        <Setting name='Q' unit='Hz' changeValue={this.changeQ} min='0' max='1' step='0.1' value={this.state.q} />
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.filter} changeConnection={this.props.changeConnection}/>
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.filter} changeConnection={this.props.changeConnection}/>
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

export default FilterNode;
