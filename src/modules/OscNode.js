import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import WaveformSelector from './WaveformSelector';
import Param from './Param';
import GenericFunctions from './GenericFunctions';
import PlayButton from './PlayButton';
import DeleteButton from './DeleteButton';

class OscNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'OscNode' + this.props.id;
      this.dsp = {
        osc: this.props.audioContext.createOscillator(),
        gain: this.props.audioContext.createGain(),
        frequencyInput: this.props.audioContext.createGain(),
      }
      this.state = {
        isPlaying: false,
        waveform: 'sine',
        frequency: new Param('frequency', 440, 20, 2000),
        gain:  new Param('gain', 0.5, 0, 1),
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
    this.dsp.frequencyInput.gain.value = this.state.frequency.max;
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

  changeValue = GenericFunctions.changeValue.bind(this);

  changeWaveform = (newWaveform) => {
    const {osc} = this.dsp;
    this.setState({waveform: newWaveform}, () => {
      osc.type = newWaveform;
    });
  }

  render() {
    return (
      <div style={style}className='OscNode'>
        <h1 style={topStyle}>
          <PlayButton style={{gridColumStart: 1}} onClick={this.togglePlay} isPlaying={this.state.isPlaying} type='audio'/>
          <p style={{display: 'inline', gridColumStart: 2}}>OSC</p>
          <DeleteButton style={{gridColumStart: 3}} onClick={this.props.deleteNode.bind(this, this.name)} type='audio'/>
        </h1>
        <WaveformSelector changeWaveform={this.changeWaveform} type='audio'/>
        <Connector type='control-input' id={this.name + '_control-input-1'} audioNode={this.dsp.frequencyInput} select={this.props.select} coordinates={{x: -30, y: -18}}/>
        <Setting name='Frequency' unit='Hz' type='audio' changeValue={this.changeValue} target={this.dsp.osc.frequency} value={this.state.frequency} />
        <br/>
        <Connector type='control-input' id={this.name + '_control-input-2'} audioNode={this.dsp.gain.gain} select={this.props.select} coordinates={{x: -30, y: -18}}/>
        <Setting name='Gain' unit='' type='audio' changeValue={this.changeValue} target={this.dsp.gain.gain} value={this.state.gain} />
        <br/>
        <br/>
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.gain} select={this.props.select} coordinates={{x: 70, y: -20}}/>
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
  display: 'grid',
  gridTemplateColumns: 'auto auto auto',
  width: '100%',
  height: '64px',
  flexDirection: 'row',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  color: '#fff',
  margin: '0px',
  padding: '0px',
  backgroundColor: 'var(--secondary1-shade3)',
}

export default OscNode;
