import React from 'react';


class WaveformSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'sine'};
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
    this.props.changeWaveform.bind(this);
    this.props.changeWaveform(event);
  }

  render () {
    return (
      <div id='WaveformSelector'>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value='sine'>Sine</option>
          <option value='triangle'>Triangle</option>
          <option value='square'>Square</option>
          <option value='saw'>Saw</option>
        </select>
      </div>
    )

  }
}

export default WaveformSelector;
