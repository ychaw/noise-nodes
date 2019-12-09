import React from 'react';
import GenericFunctions from './GenericFunctions';

export default class PlayButton extends React.Component {
  constructor(props) {
    super(props);
    this.vis = {
      dim: 12,
      colors: GenericFunctions.getColors.bind(this)(),
    };
    this.vis.strokeWidth= this.vis.dim/3 * 1.5;
    this.vis.boundary= this.vis.dim+this.vis.strokeWidth;
    this.vis.height = this.vis.dim*3;
    this.vis.width =  this.vis.dim*3;
  }

  handleClick = (e) => {
    e.preventDefault();
    this.props.onClick();
  }

  displayIcon = () => {
    const {height, width, dim, strokeWidth, colors} = this.vis;
    const x = width/2,
          y = height/2,
          factor = 1.5,
          offset = (2.2 - factor) * dim;
    return <polygon
      points={
        [x-offset, y-offset] + " " +
        [x-offset+strokeWidth/2, y-offset] + " " +
        [x, y-strokeWidth/3]  + " " +
        [x+offset-strokeWidth/2, y-offset] + " " +
        [x+offset, y-offset] + " " +
        [x+strokeWidth/3, y]  + " " +
        [x+offset, y+offset] + " " +
        [x+offset-strokeWidth/2, y+offset] + " " +
        [x, y+strokeWidth/3]  + " " +
        [x-offset+strokeWidth/2, y+offset] + " " +
        [x-offset, y+offset] + " " +
        [x-offset, y+offset] + " " +
        [x-strokeWidth/3, y]
      }
      fill={colors[4]}
      stroke={colors[4]}
      strokeWidth={strokeWidth/4}
      />;
  }


  render () {
    const {height, width, dim, strokeWidth, colors} = this.vis;
    return <svg
      height={height}
      width={width}
      style={{cursor: 'pointer'}}
      onClick={this.handleClick}
      >
      <g>
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
