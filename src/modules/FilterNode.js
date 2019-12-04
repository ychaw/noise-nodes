import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import Param from './Param';
import GenericFunctions from './GenericFunctions';

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
        frequency: new Param('frequency', 2000, 10, 20000),
        Q: new Param('Q', 0, 0.0001, 1000),
        type: 'lowpass',
      }
      this.inputs = [this.dsp.frequencyInput, this.dsp.qInput, this.dsp.filter]
      this.outputs = [this.dsp.filter]
  }

  componentDidMount() {
    this.initParams();
    this.initInputs();
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  initParams = () => {
    this.dsp.filter.frequency.value = this.state.frequency.absValue;
    this.dsp.filter.Q.value = this.state.Q.absValue;
  }

  initInputs = () => {
    this.dsp.frequencyInput.gain.value = this.state.frequency.max;
    this.dsp.frequencyInput.connect(this.dsp.filter.frequency);

    this.dsp.qInput.gain.value = this.state.Q.max;
    this.dsp.qInput.connect(this.dsp.filter.Q);
  }

  render() {
    return (
      <div style={style}className='FilterNode'>
        <h1 style={topStyle}>FLT</h1>
        <Setting name='Frequency' unit='Hz' changeValue={GenericFunctions.changeValue.bind(this)} target={this.dsp.filter.frequency} value={this.state.frequency} />
        <Connector type='control-input' id={this.name + '_control-input-1'} audioNode={this.dsp.frequencyInput} select={this.props.select}/>
        <Setting name='Q' unit='' changeValue={GenericFunctions.changeValue.bind(this)} target={this.dsp.filter.Q} value={this.state.Q} />
        <Connector type='control-input' id={this.name + '_control-input-2'} audioNode={this.dsp.qInput} select={this.props.select}/>
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.filter} select={this.props.select}/>
        <button onClick={this.props.deleteNode.bind(this, this.name)}>[X]</button>
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.filter} select={this.props.select}/>
      </div>
    );
  }
}

const style = {
  width:'200px',
  height:'350px',
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

export default FilterNode;
