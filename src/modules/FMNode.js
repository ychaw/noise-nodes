import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import WaveformSelector from './WaveformSelector';
import Param from './Param';
import GenericFunctions from './GenericFunctions';
import DeleteButton from './DeleteButton';
import Draggable from 'react-draggable';

class FMNode extends React.Component {
  constructor(props) {
      super(props);
      this.name = 'FMNode' + this.props.id;
      this.dsp = {
        osc: this.props.audioContext.createOscillator(),
        gain: this.props.audioContext.createGain(),
        frequencyInput: this.props.audioContext.createGain(),
      }
      this.state = {
        waveform: 'sine',
        frequency: new Param('frequency', 5, 0.001, 1000),
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

  changeWaveform = (newWaveform) => {
    const {osc} = this.dsp;
    this.setState({waveform: newWaveform}, () => {
      osc.type = newWaveform;
    });
  }

  changeGain = (value, target, param) => {
        const relValue = value;
        let newObj = this.state[param.tag];
        newObj.relValue = relValue;
        this.setState({[param.tag]: newObj}, ()=> {
          target.linearRampToValueAtTime(this.state[param.tag].absValue, this.props.audioContext.currentTime + 0.1);
        });
  }

  render() {
    return (
      <Draggable
        handle='.handle'
        onDrag={this.props.rebuildLineComponents}
      >
        <div style={style} className='FMNode'>
        <div className='handle'>
            <h1 style={topStyle}>
              <p style={{display: 'inline', gridColumStart: 1}}>FM</p>
              <DeleteButton style={{gridColumStart: 2}} onClick={this.props.deleteNode.bind(this, this.name)} type='control'/>
            </h1>
          </div>
          <WaveformSelector changeWaveform={this.changeWaveform} type='control'/>
          <Connector
            type='control-input'
            id={this.name + '_control-input-1'}
            audioNode={this.dsp.frequencyInput}
            select={this.props.select}
            getSelection={this.props.getSelection}
            coordinates={{x: -10, y: -4}}/>
          <Setting
            name='Frequency'
            unit='Hz'
            type='control'
            changeValue={GenericFunctions.changeValue.bind(this)}
            target={this.dsp.osc.frequency}
            value={this.state.frequency}
            readout={this.props.readout}/>
          <br/>
          <Connector
            type='control-input'
            id={this.name + '_control-input-2'}
            audioNode={this.dsp.gain.gain}
            select={this.props.select}
            getSelection={this.props.getSelection}
            coordinates={{x: -10, y: -4}}/>
          <Setting
            name='Gain'
            unit=''
            type='control'
            changeValue={this.changeGain}
            target={this.dsp.gain.gain}
            value={this.state.gain}
            readout={this.props.readout}/>
          <br/>
          <Connector
            type='control-output'
            id={this.name + '_control-output-1'}
            audioNode={this.dsp.gain}
            select={this.props.select}
            getSelection={this.props.getSelection}
            coordinates={{x: 68, y: -3}}/>
        </div>
      </Draggable>
    );
  }
}

const style = {
  width:'200px',
  height:'350px',
  position: 'absolute',
  left: '10vw',
  top: '20vh',
  backgroundColor: 'var(--secondary2-shade0)',
}

const topStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto',
  width: '100%',
  height: '64px',
  flexDirection: 'row',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  margin: '0px',
  padding: '0px',
  backgroundColor: 'var(--secondary2-shade3)',
  cursor: 'move',
}

export default FMNode;
