import React from 'react';
import Setting from './Setting';
import Connector from './Connector';
import Param from './Param';
import GenericFunctions from './GenericFunctions';
import Draggable from 'react-draggable';

class OutputNode extends React.Component {
  constructor(props) {
      super(props);
      this.name = 'OutputNode';
      this.dsp = {
        gain: this.props.audioContext.createGain(),
      };
      this.state = {
        gain: new Param('gain', 0.5, 0, 1),
      };
      this.boundingBox = React.createRef();
  }

  componentDidMount() {
    this.dsp.gain.gain.value = this.state.gain.absValue;
    this.dsp.gain.connect(this.props.audioContext.destination);
  }

  render () {
    return (
      <Draggable
        handle='.handle'
        onDrag={this.props.rebuildLineComponents}
      >
        <div style={style}>
          <div className='handle'>
            <h1 style={topStyle}>OUT</h1>
          </div>
          <Setting
          name='Gain'
          unit=''
          type='audio'
          changeValue={GenericFunctions.changeValue.bind(this)}
          readout={this.props.readout}
          target={this.dsp.gain.gain}
          value={this.state.gain}/>
        <br/>
        <Connector
          type='audio-input'
          id={this.name + '_audio-input-1'}
          audioNode={this.dsp.gain}
          select={this.props.select}
          getSelection={this.props.getSelection}
          coordinates={{x: -62, y: -72}}/>
        </div>
      </Draggable>
    );
  }
}

const style = {
  width:'170px',
  height:'150px',
  float: 'right',
  backgroundColor: 'var(--secondary1-shade0)',
  touchAction: 'none',
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
  backgroundColor: 'var(--secondary1-shade3)',
  cursor: 'move',
}

export default OutputNode;
