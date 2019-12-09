import React from 'react';
import GenericFunctions from './GenericFunctions';

export default class PlayButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };
    this.vis = {
      dim: 12,
      colors: GenericFunctions.getColors.bind(this)(),
    };
    this.vis.strokeWidth = this.vis.dim/3 * 2;
    this.vis.boundary = this.vis.dim+this.vis.strokeWidth;
    this.vis.height = this.vis.dim*3;
    this.vis.width =  this.vis.dim*3;
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
    this.props.onClick();
  }

  getStartIcon = () => {
    const {height, width, dim, colors} = this.vis,
          x = width/2,
          y = height/2,
          factor = 0.8;
    return <polygon
      points={
        [x+dim*factor, y] + ", " +
        [(x-dim/2), y+dim*factor] + ", " +
        [(x-dim/2), y-dim*factor]
      }
      fill={colors[4]}/>;
  }

  getStopIcon = () => {
    const {height, width, dim, colors} = this.vis,
          x = width/2,
          y = height/2,
          factor = 1.3;
    return <rect
      x={x - dim/2 * factor}
      y={y - dim/2 * factor}
      width={dim * factor}
      height={dim * factor}
      fill={colors[4]}/>;
  }

  displayIcon = () => {
    if(this.props.constant) {
      return this.getStartIcon();
    }
    if (this.state.isPlaying) {
      return this.getStopIcon();
    } else {
      return this.getStartIcon();
    }
  }

  render () {
    const {height, width, dim, strokeWidth, colors} = this.vis;
    return <svg
      height={height}
      width={width}
      style={{cursor: 'pointer'}}
      >
      <g onClick={this.handleClick}>
        <circle
          cx={width/2}
          cy={height/2}
          r={dim}
          stroke={colors[1]}
          strokeWidth={strokeWidth}
          fill={colors[1]}
          />
        {this.displayIcon()}
      </g>
    </svg>
  }
}
