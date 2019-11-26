import React from 'react';
import Connector from './Connector';
import Setting from './Setting';

class FilterNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'FilterNode' + this.props.id;
      this.dsp = {
        filter: this.props.audioContext.createBiquadFilter(),
        frequencyInput: this.props.audioContext.createGain(),
        qInput: this.props.audioContext.createGain(),
      }
      this.state = {
        frequency: 2000,
        Q: 0,
        type: 'lowpass',
      }
      this.boundaries = {
        minFrequency: 10,
        minQ: 0.0001,
        maxFrequency: 20000,
        maxQ: 1000,
      }
      this.inputs = [this.dsp.frequencyInput, this.dsp.qInput, this.dsp.filter]
      this.outputs = [this.dsp.filter]
  }

  componentDidMount() {
    this.initInputs();
  }

  componentWillUnmount() {
    this.props.cleanUp(this.inputs, this.outputs);
  }

  initInputs = () => {
    this.dsp.frequencyInput.gain.value = this.boundaries.maxFrequency;
    this.dsp.frequencyInput.connect(this.dsp.filter.frequency);

    this.dsp.qInput.gain.value = this.boundaries.maxQ;
    this.dsp.qInput.connect(this.dsp.filter.Q);
  }

  changeGain = (e) => {
    const {gain} = this.dsp;
    const newValue = (this.boundaries.maxGain - this.boundaries.minGain) * e.target.value + this.boundaries.minGain;
    this.setState({gain: newValue}, ()=> {
      gain.gain.value = newValue;
    });
  }

  changeFrequency = (e) => {
    const {filter} = this.dsp;
    const newValue = (this.boundaries.maxFrequency - this.boundaries.minFrequency) * e.target.value + this.boundaries.minFrequency;
    this.setState({frequency: newValue}, ()=> {
      filter.frequency.value = newValue;
    });
  }

  changeQ = (e) => {
    const {filter} = this.dsp;
    const newValue = (this.boundaries.maxQ - this.boundaries.minQ) * e.target.value + this.boundaries.minQ;
    this.setState({Q: newValue}, ()=> {
      filter.Q.value = newValue;
    });
  }

  render() {
    return (
      <div style={style}className='FilterNode'>
        <h1>{this.name}</h1>
        <Setting name='Frequency' unit='Hz' changeValue={this.changeFrequency} value={this.state.frequency} />
        <Connector type='control-input' id={this.name + '_control-input-1'} audioNode={this.dsp.frequencyInput} select={this.props.select}/>
        <Setting name='Q' unit='' changeValue={this.changeQ} value={this.state.Q} />
        <Connector type='control-input' id={this.name + '_control-input-2'} audioNode={this.dsp.qInput} select={this.props.select}/>
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.filter} select={this.props.select}/>
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.filter} select={this.props.select}/>
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
