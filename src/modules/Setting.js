import React from 'react';

class Setting extends React.Component {
  render() {
    return (
      <div style={style}>
        <p>{this.props.name}: {Number(Number(this.props.value).toPrecision(2))} {this.props.unit}</p>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={
            (this.props.value - this.props.min) /
                (this.props.max - this.props.min)
          } // Assumes both min & max values >= 0
          onChange={this.props.changeValue}
        ></input>
      </div>
    );
  }
}

const style = {
  color: '#fff',
}

export default Setting;
