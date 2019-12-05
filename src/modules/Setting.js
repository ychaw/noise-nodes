import React from 'react';
import '../style/colors.css';

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      boundingBox: React.createRef(),
    }
  }

  convertValueToDeg = (value) => {
    return value * 270 - 135;
  }

  handleMouseDown = (e) => {
    e.preventDefault();
    this.setState({
      dragging: true,
    });
  }

  handleMouseUp = (e) => {
    this.setState({
      dragging: false,
    });
  }

  handleMouseMove = (e) => {
    const factor = 1.2,
          offset = 0.1; // scale input to fit better
    if(this.state.dragging) {
            const boundingRect = this.state.boundingBox.current.getBoundingClientRect(),
            mouseX = e.clientX - boundingRect.left,
            relValue = this.clampValue(factor * mouseX / boundingRect.width - offset) // clamp value
      this.props.changeValue(relValue, this.props.target, this.props.value);
    }
  }

  clampValue = (value) => Math.max(0, Math.min( 1, value));

  // this is ugly but prevents bugs for now
  handleMouseLeave = (e) => {
    if(this.state.dragging) {
      this.handleMouseUp(e);
    }
  }

  getColors = () => {
    if(this.props.type === 'audio') {
      return [
        'var(--secondary1-shade0)',
        'var(--secondary1-shade1)',
        'var(--secondary1-shade2)',
        'var(--secondary1-shade3)',
        'var(--secondary1-shade4)',
        'var(--secondary1-shade5)',
      ]
    } else if (this.props.type === 'control') {
      return [
        'var(--secondary2-shade0)',
        'var(--secondary2-shade1)',
        'var(--secondary2-shade2)',
        'var(--secondary2-shade3)',
        'var(--secondary2-shade4)',
        'var(--secondary2-shade5)',
      ]
    }
  }

  render() {
    const {name, unit, value} = this.props;
    const x = 90,
    y = 30,
    r = 20,
    rotation = 'rotate(' + this.convertValueToDeg(this.props.value.relValue) + ' ' + x + ' ' + y + ')',
    colors = this.getColors();
    //<input type='range' min={0} max={1} step={0.01} value={value.relValue} onChange={changeValue}></input>
    return (
      <div style={style}>
        <svg
          width={2 * x}
          height={y + r}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          ref={this.state.boundingBox}>
          <g transform={rotation}>
            <circle cx={x} cy={y} r={r} fill={colors[1]}/>
            <ellipse cx={x} cy={y - 10} rx={r * 0.4} ry={r * 0.5} fill={colors[3]}/>
          </g>
        </svg>
        <p>{name}: {Number(Number(value.absValue).toPrecision(2))} {unit}</p>
        {this.props.children}
      </div>
    );
  }
}

const style = {
  color: '#fff',
}
