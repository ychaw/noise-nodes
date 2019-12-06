import React from 'react';
import Connector from './Connector';
import Setting from './Setting';
import Param from './Param';
import GenericFunctions from './GenericFunctions';
import DeleteButton from './DeleteButton';

class GainNode extends React.Component {
  constructor(props) {
      super(props);
      this.name = 'GainNode' + this.props.id;
      this.dsp = {
        gain: this.props.audioContext.createGain(),
      }
      this.state = {
        gain: new Param('gain', 0.5, 0, 1),
      }
      this.inputs = [this.dsp.gain];
      this.outputs = [this.dsp.gain];
  }

  componentDidMount() {
    this.initParams();
    this.props.rebuildLineComponents();
  }

  componentWillUnmount() {
    this.props.cleanUp(this.name);
    this.props.rebuildLineComponents();
  }

  initParams = () => {
    this.dsp.gain.gain.value = this.state.gain.absValue;
  }

  render() {
    return (
      <div style={style}className='GainNode'>
        <h1 style={topStyle}>
          <p style={{display: 'inline'}}>GAIN</p>
          <DeleteButton onClick={this.props.deleteNode.bind(this, this.name)} type='audio'/>
        </h1>
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.gain} select={this.props.select} coordinates={{x: 4, y: -18}}/>
        <Setting name='Gain' unit='' type='audio' changeValue={GenericFunctions.changeValue.bind(this)} target={this.dsp.gain.gain} value={this.state.gain} />
        <Connector type='audio-output' id={this.name + '_audio-output-1'} audioNode={this.dsp.gain} select={this.props.select} coordinates={{x: -12, y: -18}}/>
      </div>
    );
  }
}

const style = {
  width:'180px',
  height:'150px',
  float: 'left',
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
}

export default GainNode;
