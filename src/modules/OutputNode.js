import React from 'react';
import Setting from './Setting';
import Connector from './Connector';
import Param from './Param';
import GenericFunctions from './GenericFunctions';

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

  componentDidUpdate() {
    this.props.getLastNodeBottom(this.boundingBox.current.getBoundingClientRect().bottom);
  }

  render () {
    return (
      <div style={style} ref={this.boundingBox}>
        <h1 style={topStyle}>OUT</h1>
        <Setting name='Gain' unit='' changeValue={GenericFunctions.changeValue.bind(this)} target={this.dsp.gain.gain} value={this.state.gain} />
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.gain} select={this.props.select}/>
      </div>
    );
  }
}

const style = {
  width:'200px',
  height:'200px',
  float: 'left',
  backgroundColor: 'var(--secondary1-shade0)',
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
}

export default OutputNode;
