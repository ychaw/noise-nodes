import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import WaveformSelector from './WaveformSelector';
import Param from './Param';
import GenericFunctions from './GenericFunctions';
import PlayButton from './PlayButton';
import DeleteButton from './DeleteButton';
import Draggable from 'react-draggable';
import KeyHandler, { KEYPRESS } from 'react-key-handler';

var frequencies = [
  8.1757989156,       8.6619572180,       9.1770239974,
  9.7227182413,       10.3008611535,      10.9133822323,
  11.5623257097,      12.2498573744,      12.9782717994,
  13.7500000000,      14.5676175474,      15.4338531643,
  16.351597831287414, 17.323914436054505, 18.354047994837977,
  19.445436482630058, 20.601722307054366, 21.826764464562746,
  23.12465141947715,  24.499714748859326, 25.956543598746574,
  27.5,               29.13523509488062,  30.86770632850775,
  32.70319566257483,  34.64782887210901,  36.70809598967594,
  38.890872965260115, 41.20344461410875,  43.653528929125486,
  46.2493028389543,   48.999429497718666, 51.91308719749314,
  55,                 58.27047018976124,  61.7354126570155,
  65.40639132514966,  69.29565774421802,  73.41619197935188,
  77.78174593052023,  82.4068892282175,   87.30705785825097,
  92.4986056779086,   97.99885899543733,  103.82617439498628,
  110,                116.54094037952248, 123.47082531403103,
  130.8127826502993,  138.59131548843604, 146.8323839587038,
  155.56349186104046, 164.81377845643496, 174.61411571650194,
  184.9972113558172,  195.99771799087463, 207.65234878997256,
  220,                233.08188075904496, 246.94165062806206,
  261.6255653005986,  277.1826309768721,  293.6647679174076,
  311.1269837220809,  329.6275569128699,  349.2282314330039,
  369.9944227116344,  391.99543598174927, 415.3046975799451,
  440,                466.1637615180899,  493.8833012561241,
  523.2511306011972,  554.3652619537442,  587.3295358348151,
  622.2539674441618,  659.2551138257398,  698.4564628660078,
  739.9888454232688,  783.9908719634985,  830.6093951598903,
  880,                932.3275230361799,  987.7666025122483,
  1046.5022612023945, 1108.7305239074883, 1174.6590716696303,
  1244.5079348883237, 1318.5102276514797, 1396.9129257320155,
  1479.9776908465376, 1567.981743926997,  1661.2187903197805,
  1760,               1864.6550460723597, 1975.533205024496,
  2093.004522404789,  2217.4610478149766, 2349.31814333926,
  2489.0158697766,    2637.02045530296,   2793.825851464031,
  2959.955381693075,  3135.9634878539946, 3322.437580639561,
  3520,               3729.3100921447194, 3951.066410048992,
  4186.009044809578,  4434.922095629953,  4698.63628667852,
  4978.031739553295,  5274.04091060592,   5587.651702928062,
  5919.91076338615,   6271.926975707989,  6644.875161279122,
  7040,               7458.620184289437,  7902.132820097988,
  8372.018089619156,  8869.844191259906,  9397.272573357044,
  9956.06347910659,   10548.081821211836, 11175.303405856126,
  11839.8215267723,   12543.853951415975];

class OscNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'OscNode' + this.props.id;
      this.dsp = {
        osc: this.props.audioContext.createOscillator(),
        gain: this.props.audioContext.createGain(),
        frequencyInput: this.props.audioContext.createGain(),
      }
      this.minFreq = 20;
      this.maxFreq = 2000;
      this.state = {
        isPlaying: false,
        waveform: 'sine',
        frequency: new Param('frequency', 440, this.minFreq, this.maxFreq),
        gain:  new Param('gain', 0.5, 0, 1),
      }
      this.inputs = [this.dsp.frequencyInput, this.dsp.gain.gain];
      this.outputs = [this.dsp.gain];
      this.octave = 5;
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
      this.dsp.gain.gain.linearRampToValueAtTime(this.state.gain.absValue, this.props.audioContext.currentTime + 0.1);
    } else {
      this.setState({isPlaying: !this.state.isPlaying});
      this.dsp.gain.gain.linearRampToValueAtTime(0, this.props.audioContext.currentTime + 0.1);
    }
  }

  changeValue = GenericFunctions.changeValue.bind(this);

  changeGain = (value, target, param) => {
        const relValue = value;
        let newObj = this.state[param.tag];
        newObj.relValue = relValue;
        this.setState({[param.tag]: newObj}, () => {
          if(this.state.isPlaying) target.linearRampToValueAtTime(this.state[param.tag].absValue, this.props.audioContext.currentTime + 0.1);
        });
    if(!this.state.isPlaying) {
      this.dsp.gain.gain.value = 0;
    }
  }

  changeWaveform = (newWaveform) => {
    const {osc} = this.dsp;
    this.setState({waveform: newWaveform}, () => {
      osc.type = newWaveform;
    });
  }

  keysToNoteOffsetDict = {
    'a': 0,
    'w': 1,
    's': 2,
    'e': 3,
    'd': 4,
    'f': 5,
    't': 6,
    'g': 7,
    'y': 8,
    'h': 9,
    'u': 10,
    'j': 11,
    'k': 12,
  }

  getFrequencyFromKey(key) {
    let result;
    let midiNoteNumber;
    const midiNoteOffset = this.keysToNoteOffsetDict[key];
    if (midiNoteOffset !== null || midiNoteOffset !== undefined) {
      midiNoteNumber = this.octave * 12 + midiNoteOffset;
      result = frequencies[midiNoteNumber];
      return result;
    } else {
      return null;
    }
  }

  keyPressHandler(event) {
    event.preventDefault();

    const absValue = this.getFrequencyFromKey(event.key);
    if (absValue) {
      const relValue = (absValue - this.minFreq) / (this.maxFreq - this.minFreq);
      this.changeValue(relValue, this.dsp.osc.frequency, this.state.frequency);
    } else if (event.key === 'z') {
      --this.octave;
    } else if (event.key === 'x') {
      ++this.octave;
    }
  }

  keyHandlerComponents = [
    <KeyHandler keyEventName={KEYPRESS} keyValue="a" onKeyHandle={this.keyPressHandler.bind(this)} key="a"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="w" onKeyHandle={this.keyPressHandler.bind(this)} key="w"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={this.keyPressHandler.bind(this)} key="s"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="e" onKeyHandle={this.keyPressHandler.bind(this)} key="e"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="d" onKeyHandle={this.keyPressHandler.bind(this)} key="d"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="f" onKeyHandle={this.keyPressHandler.bind(this)} key="f"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="t" onKeyHandle={this.keyPressHandler.bind(this)} key="t"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="g" onKeyHandle={this.keyPressHandler.bind(this)} key="g"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="y" onKeyHandle={this.keyPressHandler.bind(this)} key="y"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="h" onKeyHandle={this.keyPressHandler.bind(this)} key="h"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="u" onKeyHandle={this.keyPressHandler.bind(this)} key="u"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="j" onKeyHandle={this.keyPressHandler.bind(this)} key="j"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="k" onKeyHandle={this.keyPressHandler.bind(this)} key="k"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="z" onKeyHandle={this.keyPressHandler.bind(this)} key="k"/>,
    <KeyHandler keyEventName={KEYPRESS} keyValue="x" onKeyHandle={this.keyPressHandler.bind(this)} key="k"/>,
  ];

  render() {
    return (
      <React.Fragment>
        {this.state.isPlaying && [...this.keyHandlerComponents]}
        <Draggable
          handle='.handle'
          onDrag={this.props.rebuildLineComponents}
        >
          <div style={style} className='OscNode'>
            <div className='handle'>
              <h1 style={topStyle}>
                <PlayButton style={{gridColumStart: 1}} onClick={this.togglePlay} isPlaying={this.state.isPlaying} type='audio'/>
                <p style={{display: 'inline', gridColumStart: 2}}>OSC</p>
                <DeleteButton style={{gridColumStart: 3}} onClick={this.props.deleteNode.bind(this, this.name)} type='audio'/>
              </h1>
            </div>
            <WaveformSelector changeWaveform={this.changeWaveform} type='audio'/>
            <Connector
              type='control-input'
              id={this.name + '_control-input-1'}
              audioNode={this.dsp.frequencyInput}
              select={this.props.select}
              getSelection={this.props.getSelection}
              coordinates={{x: -10, y: -4}}
            />
            <Setting
              name='Frequency'
              unit='Hz'
              type='audio'
              changeValue={this.changeValue}
              target={this.dsp.osc.frequency}
              value={this.state.frequency}
              readout={this.props.readout}
            />
            <br/>
            <Connector
              type='control-input'
              id={this.name + '_control-input-2'}
              audioNode={this.dsp.gain.gain}
              select={this.props.select}
              getSelection={this.props.getSelection}
              coordinates={{x: -10, y: -4}}
            />
            <Setting
              name='Gain'
              unit=''
              type='audio'
              changeValue={this.changeGain}
              target={this.dsp.gain.gain}
              value={this.state.gain}
              readout={this.props.readout}/>
            <br/>
            <br/>
            <Connector
              type='audio-output'
              id={this.name + '_audio-output-1'}
              audioNode={this.dsp.gain}
              select={this.props.select}
              getSelection={this.props.getSelection}
              coordinates={{x: 70, y: -20}}
            />
          </div>
        </Draggable>
      </React.Fragment>
    );
  }
}

const style = {
  width:'200px',
  height:'350px',
  position: 'absolute',
  left: '10vw',
  top: '20vh',
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
  cursor: 'move',
}

export default OscNode;
