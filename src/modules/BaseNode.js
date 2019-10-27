import React from 'react';
import Connector from './Connector';
import '../style/BaseNode.css';

class BaseNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'BaseNode';
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
    gain.gain.value = this.state.gain;
    osc.connect(gain);
    gain.connect(this.props.audioContext.destination);
  }

  // FOR TESTING
  togglePlay = () => {
    const {osc} = this.dsp;
    if(!this.state.isPlaying) {
      osc.start();
      this.setState({isPlaying: !this.state.isPlaying});
    } else {
      osc.stop();
      this.setState({isPlaying: !this.state.isPlaying});
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

  delete() {
    return;
  }

  render() {
    return (
      <div className='BaseNode'>
        <h1>{this.name}</h1>
        <p>Frequency: {this.state.frequency} Hz</p>
        <input type='range' min='20' max='2000' step='0.1' value={this.state.frequency} onChange={this.changeFrequency}></input>
        <p>Gain: {this.state.gain}</p>
        <input type='range' min='0' max='1' step='0.1' value={this.state.gain} onChange={this.changeGain}></input>
        <button onClick={this.togglePlay}>{this.state.isPlaying ? 'Stop' : 'Start'}</button>
        <Connector type='input' id='input-1' changeConnection={this.props.changeConnection}/>
        <Connector type='output' id='output-1' changeConnection={this.props.changeConnection}/>
      </div>
    );
  }
}

export default BaseNode;
