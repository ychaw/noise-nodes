import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import Param from './Param';
import GenericFunctions from './GenericFunctions';
import DeleteButton from './DeleteButton';
import ProfileSelector from './ProfileSelector';
import Draggable from 'react-draggable';

class FilterNode extends React.Component {

  constructor(props) {
      super(props);
      this.name = 'FilterNode' + this.props.id;
      this.dsp = {
        filter: this.props.audioContext.createBiquadFilter(),
        frequencyInput: this.props.audioContext.createGain(),
        qInput: this.props.audioContext.createGain(),
      }
      this.state = {
        frequency: new Param('frequency', 2000, 10, 20000),
        Q: new Param('Q', 0, 0.0001, 10),
        type: 'lowpass',
      }
      this.inputs = [this.dsp.frequencyInput, this.dsp.qInput, this.dsp.filter]
      this.outputs = [this.dsp.filter]
  }

  componentDidMount() {
    this.initParams();
    this.initInputs();
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  initParams = () => {
    this.dsp.filter.frequency.value = this.state.frequency.absValue;
    this.dsp.filter.Q.value = this.state.Q.absValue;
  }

  initInputs = () => {
    this.dsp.frequencyInput.gain.value = this.state.frequency.max;
    this.dsp.frequencyInput.connect(this.dsp.filter.frequency);

    this.dsp.qInput.gain.value = this.state.Q.max;
    this.dsp.qInput.connect(this.dsp.filter.Q);
  }

  changeProfile = (newProfile) => {
    const {filter} = this.dsp;
    this.setState({waveform: newProfile}, () => {
      filter.type = newProfile;
    });
  }

  render() {
    return (
      <Draggable
        handle='.handle'
        onDrag={this.props.rebuildLineComponents}
      >
        <div style={style} className='FilterNode'>
          <div className='handle'>
            <h1 style={topStyle}>
              <p style={{display: 'inline'}}>FLT</p>
              <DeleteButton type= 'audio' onClick={this.props.deleteNode.bind(this, this.name)} />
            </h1>
          </div>
          <ProfileSelector
            changeProfile={this.changeProfile}
            type='audio'/>
        <Connector
          type='control-input'
          id={this.name + '_control-input-1'}
          audioNode={this.dsp.frequencyInput}
          select={this.props.select}
          getSelection={this.props.getSelection}
          coordinates={{x: -20, y: -4}}/>
        <Setting
          name='Frequency'
          unit='Hz'
          type='audio'
          changeValue={GenericFunctions.changeValue.bind(this)}
          target={this.dsp.filter.frequency}
          value={this.state.frequency}
          readout={this.props.readout}/>
        <br/>
        <Connector
          type='control-input'
          id={this.name + '_control-input-2'}
          audioNode={this.dsp.qInput}
          select={this.props.select}
          getSelection={this.props.getSelection}
          coordinates={{x: -20, y: -4}}/>
        <Setting
          name='Q'
          unit=''
          type='audio'
          changeValue={GenericFunctions.changeValue.bind(this)}
          target={this.dsp.filter.Q}
          value={this.state.Q}
          readout={this.props.readout}/>
        <br/>
        <Connector
          type='audio-input'
          id={this.name + '_audio-input-1'}
          audioNode={this.dsp.filter}
          select={this.props.select}
          getSelection={this.props.getSelection}
          coordinates={{x: -35, y: 0}}/>
        <Connector
          type='audio-output'
          id={this.name + '_audio-output-1'}
          audioNode={this.dsp.filter}
          select={this.props.select}
          getSelection={this.props.getSelection}
          coordinates={{x: 30, y: 0}}/>
        </div>
      </Draggable>
    );
  }
}

const style = {
  width:'180px',
  height:'350px',
  position: 'absolute',
  left: '10vw',
  top: '20vh',
  backgroundColor: 'var(--secondary1-shade0)',
}

const topStyle = {
  display: 'grid',
  gridTemplateColumns: '70% auto',
  width: '100%',
  height: '64px',
  flexDirection: 'row',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  margin: '0px',
  padding: '0px',
  backgroundColor: 'var(--secondary1-shade3)',
  cursor: 'move',
}

export default FilterNode;
