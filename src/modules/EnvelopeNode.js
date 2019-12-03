import React from 'react';
import Connector from './Connector';
import Setting from './Setting';

class EnvelopeNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'EnvelopeNode' + this.props.id;
      this.dsp = {
        constantSource: this.props.audioContext.createConstantSource(),
        gain: this.props.audioContext.createGain(),
      }
      this.state = {
        isPlaying: false,
        gain: 1,
        attack: 1,
        decay: 1,
        sustain:  0.5,
        release: 1,
      }
      this.boundaries = {
        minGain: 0,
        minAttack: 0,
        minDecay: 0,
        minSustain:  0,
        minRelease: 0,
        maxGain: 1,
        maxAttack: 1,
        maxDecay: 1,
        maxSustain:  1,
        maxRelease: 1,
      }
      this.inputs = []
      this.outputs = [this.dsp.gain]
  }

  componentDidMount() {
    const {constantSource, gain} = this.dsp;
    constantSource.connect(gain);
    gain.gain.setValueAtTime(this.state.gain, this.props.audioContext.currentTime);
    constantSource.start();
  }

  componentWillUnmount() {
    this.dsp.constantSource.stop();
    this.props.cleanUp(this.name);
  }

  // FOR TESTING
  togglePlay = () => {

    //cancelAndHold would be nicer, but isn't supported in firefox
    this.dsp.gain.gain.cancelScheduledValues(0);

    const targetGain = this.state.gain > 0 ? this.state.gain : 0.001,
          node = this.dsp.gain,
          endTimes = [
            this.props.audioContext.currentTime + this.state.attack,
            this.props.audioContext.currentTime + this.state.attack + this.state.decay,
            this.props.audioContext.currentTime + this.state.attack + this.state.decay + this.state.release,
          ];

    node.gain.linearRampToValueAtTime(targetGain, endTimes[0]);
    node.gain.linearRampToValueAtTime(this.state.sustain, endTimes[1]);
    node.gain.linearRampToValueAtTime(0.001, endTimes[2]);

  }

  changeGain = (e) => {
    const newValue = (this.boundaries.maxGain - this.boundaries.minGain) * e.target.value + this.boundaries.minGain;
    this.setState({gain: newValue}, ()=> {
    });
  }

  changeAttack = (e) => {
    const newValue = (this.boundaries.maxAttack - this.boundaries.minAttack) * e.target.value + this.boundaries.minAttack;
    this.setState({attack: newValue}, () => {

    });
  }

  changeDecay = (e) => {
    const newValue = (this.boundaries.maxDecay - this.boundaries.minDecay) * e.target.value + this.boundaries.minDecay;
    this.setState({decay: newValue}, () => {

    });
  }

  changeSustain = (e) => {
    const newValue = (this.boundaries.maxSustain - this.boundaries.minSustain) * e.target.value + this.boundaries.minSustain;
    this.setState({sustain: newValue}, () => {

    });
  }

  changeRelease = (e) => {
    const newValue = (this.boundaries.maxRelease - this.boundaries.minRelease) * e.target.value + this.boundaries.minRelease;
    this.setState({release: newValue}, () => {

    });
  }

  render() {
    return (
      <div style={style}className='EnvelopeNode'>
        <h1 style={topStyle}>ENV</h1>
        <Setting
          name='Gain'
          unit=''
          changeValue={this.changeGain}
          value={this.state.gain}
          min={this.boundaries.minGain}
          max={this.boundaries.maxGain}
        />
        <Setting
          name='Attack'
          unit='s'
          changeValue={this.changeAttack}
          value={this.state.attack}
          min={this.boundaries.minAttack}
          max={this.boundaries.maxAttack}
        />
        <Setting
          name='Decay'
          unit='s'
          changeValue={this.changeDecay}
          value={this.state.decay}
          min={this.boundaries.minDecay}
          max={this.boundaries.maxDecay}
        />
        <Setting
          name='Sustain'
          unit=''
          changeValue={this.changeSustain}
          value={this.state.sustain}
          min={this.boundaries.minSustain}
          max={this.boundaries.maxSustain}
        />
        <Setting
          name='Release'
          unit='s'
          changeValue={this.changeRelease}
          value={this.state.release}
          min={this.boundaries.minRelease}
          max={this.boundaries.maxRelease}
        />
        <button onClick={this.togglePlay}>{this.state.isPlaying ? 'Stop' : 'Start'}</button>
        <button onClick={this.props.deleteNode.bind(this, this.name)}>[X]</button>
        <Connector type='control-output' id={this.name + '_control-output-1'} audioNode={this.dsp.gain} select={this.props.select}/>
      </div>
    );
  }
}

const style = {
  width:'250px',
  height:'450px',
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

export default EnvelopeNode;
