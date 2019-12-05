import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import WaveformSelector from './WaveformSelector';
import Param from './Param';
import GenericFunctions from './GenericFunctions';

class LFONode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'LFONode' + this.props.id;
      this.dsp = {
        osc: this.props.audioContext.createOscillator(),
        gain: this.props.audioContext.createGain(),
        frequencyInput: this.props.audioContext.createGain(),
      }
      this.state = {
        isPlaying: false,
        waveform: 'sine',
        frequency: new Param('frequency', 5, 0.001, 200),
        gain: new Param('gain', 0.5, 0, 1),
      }
      this.inputs = [this.dsp.frequencyInput, this.dsp.gain.gain];
      this.outputs = [this.dsp.gain];
  }

  componentDidMount() {
    const {osc, gain} = this.dsp;
    this.initParams();
    osc.connect(gain);
    osc.start();

    this.initInputs();
    this.props.rebuildLineComponents();
  }

  initParams = () => {
    this.dsp.osc.frequency.value = this.state.frequency.absValue;
    this.dsp.gain.gain.value = 0;
  }

  initInputs = () => {
    this.dsp.frequencyInput.gain.value = this.state.gain.max;
    this.dsp.frequencyInput.connect(this.dsp.osc.frequency);
  }

  componentWillUnmount() {
    this.dsp.osc.stop();
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  // FOR TESTING
  togglePlay = () => {
    if(!this.state.isPlaying) {
      this.setState({isPlaying: !this.state.isPlaying});
      this.dsp.gain.gain.value = this.state.gain.absValue;
    } else {
      this.setState({isPlaying: !this.state.isPlaying});
      this.dsp.gain.gain.value = 0;
    }
  }

  changeWaveform = (e) => {
    const {osc} = this.dsp;
    const newValue = e.target.value
    this.setState({waveform: newValue}, () => {
      osc.type = newValue;
    });
  }

  render() {
    return (
      <div style={style}className='LFONode'>
        <h1 style={topStyle}>LFO</h1>
        <WaveformSelector changeWaveform={this.changeWaveform}/>
        <Setting name='Frequency' unit='Hz' type='control' changeValue={GenericFunctions.changeValue.bind(this)} target={this.dsp.osc.frequency} value={this.state.frequency} />
        <Connector type='control-input' id={this.name + '_control-input-1'} audioNode={this.dsp.frequencyInput} select={this.props.select}/>
        <Setting name='Gain' unit='' type='control' changeValue={GenericFunctions.changeValue.bind(this)} target={this.dsp.gain.gain} value={this.state.gain} />
        <Connector type='control-input' id={this.name + '_control-input-2'} audioNode={this.dsp.gain.gain} select={this.props.select}/>
        <button onClick={this.togglePlay}>{this.state.isPlaying ? 'Stop' : 'Start'}</button>
        <button onClick={this.props.deleteNode.bind(this, this.name)}>[X]</button>
        <Connector type='control-output' id={this.name + '_control-output-1'} audioNode={this.dsp.gain} select={this.props.select}/>
      </div>
    );
  }
}

const style = {
  width:'200px',
  height:'350px',
  float: 'left',
  backgroundColor: 'var(--secondary2-shade0)',
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
  backgroundColor: 'var(--secondary2-shade3)',
}

export default LFONode;
