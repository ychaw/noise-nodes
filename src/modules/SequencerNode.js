import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import SequencerNodeButtons from './SequencerNodeButtons';
import IntegerParam from './IntegerParam';
import PlayButton from './PlayButton';
import DeleteButton from './DeleteButton';

// this class mutates its internal state (this.sequencer) a lot, take care when making changes

class SequencerNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'SequencerNode' + this.props.id;
      this.dsp = {
        gate: this.props.audioContext.createConstantSource(),
      }
      this.state = {
        isPlaying: false,
        bpm: new IntegerParam('bpm', 60, 10, 240),
        beats: new IntegerParam('beats', 8, 1, 32),
        activeBeats: [],
        beatOffsets: [],
      }
      this.sequencer = {
        currentNote: 0,
        nextNoteTime: 0.0,
        lookahead: 25.0,
        scheduleAheadTime: 0.1,
        notesInQueue: [],
      }
      this.internalEnvelope = {
        a: 0.1,
        d: 0.05,
        r: 0.1,
      }
      this.timerID = null;
      this.inputs = [];
      this.outputs = [this.dsp.gate];
  }

  componentDidMount() {
    const {gate} = this.dsp;
    gate.offset.setValueAtTime(0, this.props.audioContext.currentTime);
    gate.start();
    this.initializeActiveBeats();
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    this.dsp.gate.stop();
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  initializeActiveBeats = () => {
    let updatedBeats = [];
    for (var i = 0; i < this.state.beats.absValue; i++) {
      updatedBeats.push(false);
    }
    this.setState({activeBeats: updatedBeats});
  }

  // scheduling functions taken from https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques

  nextNote = () => {
    const secondsPerBeat = 60.0 / this.state.bpm.absValue;
    this.sequencer.nextNoteTime += secondsPerBeat;
    this.sequencer.currentNote++;
    if(this.sequencer.currentNote === this.state.beats.absValue) this.sequencer.currentNote = 0;
  }

  scheduleNote = (beatNumber, time) => {
    this.sequencer.notesInQueue.push({note: beatNumber, time: time});
    //match the currentNote against the beats toggled active
    if(this.state.activeBeats.find(
      (value, index, array) => this.sequencer.currentNote === index && value)) this.sendSignal()
  }

  scheduler = () => {
    while (this.sequencer.nextNoteTime < this.props.audioContext.currentTime + this.sequencer.scheduleAheadTime) {
      this.scheduleNote(this.sequencer.currentNote, this.sequencer.nextNoteTime);
      this.nextNote();
    }
    this.dequeueNotes();
    this.timerID = window.setTimeout(this.scheduler, this.sequencer.lookahead);
  }

  dequeueNotes = () => {
    let currentTime = this.props.audioContext.currentTime;
    while(this.sequencer.notesInQueue.length && this.sequencer.notesInQueue[0].time < currentTime) {
      this.sequencer.notesInQueue.splice(0,1);
    }
  }

  sendSignal = ()  => {
    this.dsp.gate.offset.cancelScheduledValues(this.props.audioContext.currentTime);
    this.dsp.gate.offset.linearRampToValueAtTime(1, this.props.audioContext.currentTime + this.internalEnvelope.a);
    this.dsp.gate.offset.linearRampToValueAtTime(1, this.props.audioContext.currentTime + this.internalEnvelope.d);
    this.dsp.gate.offset.linearRampToValueAtTime(0, this.props.audioContext.currentTime + this.internalEnvelope.r);

  }


  // FOR TESTING
  togglePlay = () => {
    const {isPlaying} = this.state;
    this.setState({isPlaying: !isPlaying}, () => {
      if(!isPlaying) {
        this.sequencer.currentNote = 0;
        this.sequencer.nextNoteTime = this.props.audioContext.currentTime;
        this.scheduler();
      } else {
        window.clearTimeout(this.timerID);
      }
    });

  }

  changeBPM = (value) => {
    let newObj = this.state.bpm;
    newObj.relValue = value;
    this.setState({bpm: newObj}, ()=> {
    });
  }

  changeBeats = (value) => {
    let newObj = this.state.beats;
    newObj.relValue = value;
    this.setState({beats: newObj}, ()=> {
      let activeBeats = this.state.activeBeats;

      // trim the activeBeats array to fit
      while(activeBeats.length > this.state.beats.absValue) {
        activeBeats.pop();
      }

      while(activeBeats.length < this.state.beats.absValue) {
        activeBeats.push(false);
      }
    });
  }

  renderSequencerButtons = () => {
    const {beats, activeBeats} = this.state;
    let buttons = [];

    for (var i = 0; i < beats.absValue; i++) {
      buttons.push(
        <button onClick={this.toggleBeat.bind(this, i)} key={i.toString()}>
          {activeBeats[i] ? 'X' : 'O'}
        </button>
      );
    }

    return buttons;
  }

  toggleBeat = (index) => {
    let updatedBeats = this.state.activeBeats;
    updatedBeats[index] = !updatedBeats[index];
    this.setState({
      activeBeats: updatedBeats,
    });
  }

  render() {
    return (
      <div style={style} className='SequencerNode'>
        <h1 style={topStyle}>
          <PlayButton style={{gridColumStart: 1}} onClick={this.togglePlay} isPlaying={this.state.isPlaying} type='control'/>
          <p style={{display: 'inline', gridColumStart: 2}}>SEQ</p>
          <DeleteButton style={{gridColumStart: 3}} onClick={this.props.deleteNode.bind(this, this.name)} type='control'/>
        </h1>
        <Setting
          name='BPM'
          unit=''
          type='control'
          changeValue={this.changeBPM}
          value={this.state.bpm}
        />
        <Setting
          name='Beats'
          unit=''
          type='control'
          changeValue={this.changeBeats}
          value={this.state.beats}
        />
        <SequencerNodeButtons
          onClick={this.toggleBeat}
          active={this.state.activeBeats}
          beats={this.state.beats} />
        <br></br>
        <Connector type='control-output' id={this.name + '_control-output-1'} audioNode={this.dsp.gate} select={this.props.select} coordinates={{x: 115, y: -20}}/>
      </div>
    );
  }
}

const style = {
  width:'300px',
  height:'350px',
  float: 'left',
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
  justifyContent: 'space-evenly',
  color: '#fff',
  margin: '0px',
  padding: '0px',
  backgroundColor: 'var(--secondary2-shade3)',
}

export default SequencerNode;
