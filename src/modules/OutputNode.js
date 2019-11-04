import React from 'react';
import Setting from './Setting';
import Connector from './Connector';

class OutputNode extends React.Component {
  constructor(props) {
      super(props);
      this.name = 'OutputNode';
      this.dsp = {
        gain: this.props.audioContext.createGain(),
      };
      this.state = {
        gain: 0.5,
      };
  }

  componentDidMount() {
    this.dsp.gain.connect(this.props.audioContext.destination);
  }

  changeGain = (e) => {
    const {gain} = this.dsp;
    const newValue = e.target.value;
    this.setState({gain: newValue}, ()=> {
      gain.gain.value = newValue;
    });
  }

  render () {
    return (
      <div>
        <h1>{this.name}</h1>
        <Setting name='Gain' unit='' changeValue={this.changeGain} min='0' max='1' step='0.1' value={this.state.gain} />
        <Connector type='audio-input' id={this.name + '_audio-input-1'} audioNode={this.dsp.gain} changeConnection={this.props.changeConnection}/>
      </div>
    );
  }
}

export default OutputNode;
