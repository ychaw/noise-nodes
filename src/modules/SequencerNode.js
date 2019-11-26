import React from 'react';
import Connector from './Connector';
import Setting from './Setting';

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
        bpm: 60,
        beats: 8,
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
      this.boundaries = {
        minBPM: 10,
        minBeats: 1,
        maxBPM: 240,
        maxBeats: 32,
      }
      this.inputs = [];
      this.outputs = [this.dsp.gate];
  }

  componentDidMount() {
    const {gate} = this.dsp;
    gate.offset.setValueAtTime(0, this.props.audioContext.currentTime);
    gate.start();
    this.initializeActiveBeats();

  }

  componentWillUnmount() {
    this.dsp.gate.stop();
    this.props.cleanUp(this.inputs, this.outputs);
  }

  initializeActiveBeats = () => {
    let updatedBeats = [];
    for (var i = 0; i < this.state.beats; i++) {
      updatedBeats.push(false);
    }
    this.setState({activeBeats: updatedBeats});
  }

  // scheduling functions taken from https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques

  nextNote = () => {
    const secondsPerBeat = 60.0 / this.state.bpm;
    this.sequencer.nextNoteTime += secondsPerBeat;
    this.sequencer.currentNote++;
    if(this.sequencer.currentNote === this.state.beats) this.sequencer.currentNote = 0;
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

  changeBPM = (e) => {
    const newValue = Math.round((this.boundaries.maxBPM - this.boundaries.minBPM) * e.target.value + this.boundaries.minBPM);
    this.setState({bpm: newValue}, ()=> {
    });
  }

  changeBeats = (e) => {
    const newValue = Math.round((this.boundaries.maxBeats - this.boundaries.minBeats) * e.target.value + this.boundaries.minBeats);
    let activeBeats = this.state.activeBeats;

    // trim the activeBeats array to fit
    while(activeBeats.length > newValue) {
        activeBeats.pop();
    }

    while(activeBeats.length < newValue) {
        activeBeats.push(false);
    }

    this.setState({beats: newValue}, ()=> {
    });
  }

  renderSequencerButtons = () => {
    const {beats, activeBeats} = this.state;
    let buttons = [];

    for (var i = 0; i < beats; i++) {
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
        <h1>{this.name}</h1>
        <Setting name='BPM' unit='' changeValue={this.changeBPM} value={this.state.bpm} />
        <Setting name='Beats' unit='' changeValue={this.changeBeats} value={this.state.beats} />
        {this.renderSequencerButtons()}
        <button onClick={this.togglePlay}>{this.state.isPlaying ? 'Stop' : 'Start'}</button>
        <Connector type='control-output' id={this.name + '_control-output-1'} audioNode={this.dsp.gate} select={this.props.select}/>
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

export default SequencerNode;
