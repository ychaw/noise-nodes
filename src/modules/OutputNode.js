import React from 'react';
import Setting from './Setting';
import Connector from './Connector';

class OutputNode extends React.Component {
  constructor(props) {
      super(props);
      this.name = 'OutputNode';
      this.dsp = {
        gain: this.props.audioContext.createGain(),
      };
      this.state = {
        gain: 0.5,
      };
      this.boundaries = {
        minGain: 0,
        maxGain: 1,
      }
  }

  componentDidMount() {
    this.dsp.gain.connect(this.props.audioContext.destination);
  }

  changeGain = (e) => {
    const {gain} = this.dsp;
    const newValue = (this.boundaries.maxGain - this.boundaries.minGain) * e.target.value + this.boundaries.minGain;
    this.setState({gain: newValue}, ()=> {
      gain.gain.value = newValue;
    });
  }

  render () {
    return (
      <div>
        <h1>{this.name}</h1>
        <Setting name='Gain' unit='' changeValue={this.changeGain} value={this.state.gain} />
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.gain} select={this.props.select}/>
      </div>
    );
  }
}

export default OutputNode;
