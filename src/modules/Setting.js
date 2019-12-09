import React from 'react';
import '../style/colors.css';
import GenericFunctions from './GenericFunctions';

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      boundingBox: React.createRef(),
    }
    this.vis = {
      r: 20,
    }
    this.vis.width = this.vis.r * 4;
    this.vis.height = this.vis.r * 3.5;
    this.vis.cx = (this.vis.width - (this.vis.r / 2)) / 2;
    this.vis.cy = (this.vis.height - (this.vis.r * 0.8)) / 2;
    this.touchRange = this.vis.r * 4;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mouseleave', this.handleMouseLeave);
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
    e.preventDefault();
    this.setState({
      dragging: false,
    });
  }

  handleMouseMove = (e) => {
    e.preventDefault();
    if(this.state.dragging) {
            const factor = 1.2,
              offset = 0.1, // scale input to fit better
              boundingRect = this.state.boundingBox.current.getBoundingClientRect(),
              mouseX = e.clientX - boundingRect.left,
              relValue = this.clampValue(factor * mouseX / boundingRect.width - offset); // clamp value
      this.props.changeValue(relValue, this.props.target, this.props.value);
      this.props.readout(this.props.name, this.props.value)
    }
  }

  clampValue = (value) => Math.max(0, Math.min( 1, value));

  // this is ugly but prevents bugs for now
  handleMouseLeave = (e) => {
    e.preventDefault();
    if(this.state.dragging) {
      this.handleMouseUp(e);
    }
  }

  render() {
    const {name} = this.props;
    const {cx, cy, r, width, height} = this.vis;
    const rotation = 'rotate(' + this.convertValueToDeg(this.props.value.relValue) + ' ' + cx + ' ' + cy + ')',
          colors = GenericFunctions.getColors.bind(this)();
    return (
        <svg
          style={{position: 'inherit', cursor: this.state.dragging ? 'pointer' : 'default'}}
          width={width}
          height={height}
          ref={this.state.boundingBox}>
          <g
            onMouseDown={this.handleMouseDown}
            transform={rotation}
            style={{cursor: 'pointer'}}
            >
            <circle cx={cx} cy={cy} r={r} fill={colors[1]}/>
            <ellipse cx={cx} cy={cy -10} rx={r * 0.4} ry={r * 0.5} fill={colors[3]}/>
          </g>
          <text
            x={cx-(name.length * 4)}
            y={height-4}
            style={{font: 'regular 12px sans-serif', fill:'#fff', cursor: 'default'}}
            >
            {name}
          </text>
        </svg>
    );
  }
}

//: {Number(Number(value.absValue).toPrecision(2))} {unit}
