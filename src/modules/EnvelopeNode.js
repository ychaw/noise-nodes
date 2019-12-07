import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import Param from './Param';
import PlayButton from './PlayButton';
import DeleteButton from './DeleteButton';
import Draggable from 'react-draggable';

class EnvelopeNode extends React.Component {
  constructor(props) {
      super(props);
      this.name = 'EnvelopeNode' + this.props.id;
      this.dsp = {
        constantSource: this.props.audioContext.createConstantSource(),
      }
      this.state = {
        isPlaying: false,
        attack: new Param('attack', 0.005, 0, 1),
        aLevel: new Param('aLevel', 1, 0, 1),
        decay: new Param('decay', 0.626, 0, 1),
        sustain:  new Param('sustain', 0.5, 0, 1),
        release: new Param('release', 0.5, 0, 1),
      }
      this.inputs = []
      this.outputs = [this.dsp.constantSource]
  }

  componentDidMount() {
    const {constantSource} = this.dsp;
    constantSource.offset.value = 0;
    constantSource.start();
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    if(this.dsp.constantSource) this.dsp.constantSource.stop();
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }



  // FOR TESTING
  togglePlay = () => {
    //cancelAndHold would be nicer, but isn't supported in firefox
    this.dsp.constantSource.offset.cancelScheduledValues(0);
    console.log('Playing env');

    const targetGain = this.state.aLevel.absValue,
    node = this.dsp.constantSource,
    endTimes = [
      this.props.audioContext.currentTime + this.state.attack.absValue,
      this.props.audioContext.currentTime + this.state.attack.absValue + this.state.decay.absValue,
      this.props.audioContext.currentTime + this.state.attack.absValue + this.state.decay.absValue + this.state.release.absValue,
    ];

    node.offset.linearRampToValueAtTime(targetGain, endTimes[0]);
    node.offset.linearRampToValueAtTime(this.state.sustain.absValue, endTimes[1]);
    node.offset.linearRampToValueAtTime(0, endTimes[2])

  }

  changeValue = (relValue, target, param) => {
    let newObj = this.state[param.tag];
    newObj.relValue = relValue;
    this.setState({[param.tag]: newObj}, ()=> {
    });
  }

  render() {
    return (
      <Draggable
        handle='.handle'
        bounds='.workspace'
        onDrag={this.props.rebuildLineComponents}
      >
      <div style={style}className='EnvelopeNode'>
        <div className='handle'>
          <h1 style={topStyle}>
            <PlayButton onClick={this.togglePlay} constant={true} type='control'/>
            <p>ENV</p>
            <DeleteButton onClick={this.props.deleteNode.bind(this, this.name)} type='control'/>
          </h1>
        </div>
        <Setting name='Attack' unit='s' type='control' changeValue={this.changeValue} target={'none'} value={this.state.attack} />
        <Setting name='aLevel' unit='' type='control' changeValue={this.changeValue} target={'none'} value={this.state.aLevel} />
        <Setting name='Decay' unit='s' type='control' changeValue={this.changeValue} target={'none'} value={this.state.decay} />
        <Setting name='Sustain' unit='' type='control' changeValue={this.changeValue} target={'none'} value={this.state.sustain} />
        <Setting name='Release' unit='s' type='control' changeValue={this.changeValue} target={'none'} value={this.state.release} />
        <br/>
        <Connector type='control-output' id={this.name + '_control-output-1'} audioNode={this.dsp.constantSource} select={this.props.select} getSelection={this.props.getSelection} coordinates={{x: 95, y: -18}}/>
      </div>
      </Draggable>
    );
  }
}

const style = {
  width:'250px',
  height:'250px',
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
  cursor: 'move',
}

export default EnvelopeNode;
