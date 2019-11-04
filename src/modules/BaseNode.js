import React from 'react';
import Connector from './Connector';
import Setting from './Setting';

class BaseNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'BaseNode' + this.props.id;
      this.dsp = {
        osc: this.props.audioContext.createOscillator(),
        gain: this.props.audioContext.createGain(),
      }
      this.state = {
        isPlaying: false,
        frequency: 440,
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
    this.setState({frequency: newValue}, ()=> {
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

  render() {
    return (
      <div style={style}className='BaseNode'>
        <h1>{this.name}</h1>
        <Setting name='Frequency' unit='Hz' changeValue={this.changeFrequency} min='20' max='2000' step='0.1' value={this.state.frequency} />
        <Setting name='Gain' unit='' changeValue={this.changeGain} min='0' max='1' step='0.1' value={this.state.gain} />
        <button onClick={this.togglePlay}>{this.state.isPlaying ? 'Stop' : 'Start'}</button>
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

export default BaseNode;
