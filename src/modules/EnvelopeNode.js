import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import Param from './Param';

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
        gain: new Param('gain', 1, 0, 1),
        attack: new Param('attack', 1, 0, 1),
        decay: new Param('decay', 1, 0, 1),
        sustain:  new Param('sustain', 0.5, 0, 1),
        release: new Param('release', 1, 0, 1),
      }
      this.inputs = []
      this.outputs = [this.dsp.gain]
  }

  componentDidMount() {
    const {constantSource, gain} = this.dsp;
    this.initParams();
    constantSource.connect(gain);
    constantSource.start();
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    this.dsp.constantSource.stop();
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  initParams = () => {
    this.dsp.gain.gain.setValueAtTime(this.state.gain.absValue, this.props.audioContext.currentTime);
  }

  // FOR TESTING
  togglePlay = () => {
    //cancelAndHold would be nicer, but isn't supported in firefox
    this.dsp.gain.gain.cancelScheduledValues(0);

    const targetGain = this.state.gain.absValue > 0 ? this.state.gain.absValue : 0.001,
          node = this.dsp.gain,
          endTimes = [
            this.props.audioContext.currentTime + this.state.attack.absValue,
            this.props.audioContext.currentTime + this.state.attack.absValue + this.state.decay.absValue,
            this.props.audioContext.currentTime + this.state.attack.absValue + this.state.decay.absValue + this.state.release.absValue,
          ];

    node.gain.linearRampToValueAtTime(targetGain, endTimes[0]);
    node.gain.linearRampToValueAtTime(this.state.sustain.absValue, endTimes[1]);
    node.gain.linearRampToValueAtTime(0.001, endTimes[2]);

  }

  changeValue = (e, target, param) => {
    const relValue = e.target.value;
    let newObj = this.state[param.tag];
    newObj.relValue = relValue;
    this.setState({[param.tag]: newObj}, ()=> {
    });
  }

  render() {
    return (
      <div style={style}className='EnvelopeNode'>
        <h1 style={topStyle}>ENV</h1>
        <Setting name='Gain' unit='' changeValue={this.changeValue} target={'none'} value={this.state.gain} />
        <Setting name='Attack' unit='s' changeValue={this.changeValue} target={'none'} value={this.state.attack} />
        <Setting name='Decay' unit='s' changeValue={this.changeValue} target={'none'} value={this.state.decay} />
        <Setting name='Sustain' unit='' changeValue={this.changeValue} target={'none'} value={this.state.sustain} />
        <Setting name='Release' unit='s' changeValue={this.changeValue} target={'none'} value={this.state.release} />
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
