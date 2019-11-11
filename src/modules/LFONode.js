import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import WaveformSelector from './WaveformSelector';

class LFONode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'LFONode' + this.props.id;
      this.dsp = {
        osc: this.props.audioContext.createOscillator(),
        gain: this.props.audioContext.createGain(),
      }
      this.state = {
        isPlaying: false,
        waveform: 'sine',
        frequency: 5,
        gain: 0.5,
      }
  }

  componentDidMount() {
    const {osc, gain} = this.dsp;
    osc.frequency.value = this.state.frequency;
    gain.gain.value = 0;
    osc.connect(gain);
    osc.start();
  }

  componentWillUnmount() {
    this.dsp.osc.stop();
  }

  // FOR TESTING
  togglePlay = () => {
    if(!this.state.isPlaying) {
      this.setState({isPlaying: !this.state.isPlaying});
      this.dsp.gain.gain.value = this.state.gain;
    } else {
      this.setState({isPlaying: !this.state.isPlaying});
      this.dsp.gain.gain.value = 0;
    }
  }

  changeFrequency = (e) => {
    const {osc} = this.dsp;
    const newValue = e.target.value;
    this.setState({frequency: newValue}, () => {
      osc.frequency.value = newValue;
    });
  }

  changeGain = (e) => {
    const {gain} = this.dsp;
    const newValue = e.target.value;
    this.setState({gain: newValue}, ()=> {
      gain.gain.value = newValue;
    });
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
        <h1>{this.name}</h1>
        <WaveformSelector changeWaveform={this.changeWaveform}/>
        <Setting name='Frequency' unit='Hz' changeValue={this.changeFrequency} min='0' max='2000' step='0.1' value={this.state.frequency} />
        <Connector type='control-input' id={this.name + '_control-input-1'} audioNode={this.dsp.osc.frequency} changeConnection={this.props.changeConnection}/>
        <Setting name='Gain' unit='' changeValue={this.changeGain} min='0' max='2000' step='0.1' value={this.state.gain} />
        <button onClick={this.togglePlay}>{this.state.isPlaying ? 'Stop' : 'Start'}</button>
        <Connector type='control-input' id={this.name + '_control-input-2'} audioNode={this.dsp.gain.gain} changeConnection={this.props.changeConnection}/>
        <Connector type='control-output' id={this.name + '_control-output-1'} audioNode={this.dsp.gain} changeConnection={this.props.changeConnection}/>
        <button onClick={this.props.deleteNode.bind(this, this.name)}>[X]</button>
      </div>
    );
  }
}

const style = {
  width:'200px',
  height:'350px',
  float: 'left',
  backgroundColor: 'var(--secondary2-shade0)',
  padding: '16px',
  border: '8px solid',
  borderColor: 'var(--secondary2-shade3)',
}

export default LFONode;