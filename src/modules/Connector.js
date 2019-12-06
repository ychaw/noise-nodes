import React from 'react';

class Connector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    }
    this.vis = {
      height: 50,
      width: 50,
      dim: 16,
      colors: this.getColors(),
      isInput: this.isInput(),
      transformToInputPosition: 'translate(x y)'.replace('x',  this.props.coordinates.x).replace('y', this.props.coordinates.y),
    }
    this.vis.strokeWidth = this.vis.dim/3 * 2;
    this.vis.boundary = this.vis.dim+this.vis.strokeWidth;
  }

  componentDidMount() {
  }

  handleClick = (e) => {
    const {id, type, audioNode} = this.props;
    this.props.select(id, type, audioNode);
    //return <button className={this.props.id} style={style} id='connector-button' onClick={this.props.select.bind(this, id, type, audioNode)}>{type}</button>
  }

  getColors = () => {
    if(RegExp('audio-.*').test(this.props.type)) {
      return {stroke: 'var(--secondary1-shade1)', fill: 'var(--secondary1-shade0)'}
    } else if(RegExp('control-.*').test(this.props.type)) {
      return {stroke: 'var(--secondary2-shade1)', fill: 'var(--secondary2-shade0)'}
    }
  }

  isInput = () => {
    return RegExp('.-input').test(this.props.type);
  }

  getTranslation = (height, width, dim) => {
    if (this.isInput()) {
      return 'translate(x y)'.replace('x',  2 * ( -width + dim)).replace('y', -20);
    } else {
      return 'translate(x y)'.replace('x', (dim/3)).replace('y', -20);
    }
  }

  render() {
    let height = 50,
        width = 50,
        dim = 16,
        strokeWidth = dim/3 * 2,
        boundary = dim+strokeWidth,
        colors = this.getColors(),
        isInput = this.isInput(),
        transformToInputPosition = 'translate(x y)'.replace('x',  this.props.coordinates.x).replace('y', this.props.coordinates.y);
    return <svg
      className={this.props.id}
      height={height}
      transform={transformToInputPosition}
      width={width}
      style={{cursor: 'pointer'}}
      >
      <circle
         cx={isInput ? boundary : width - boundary}
         cy={dim + strokeWidth}
         r={dim}
         stroke={colors.stroke}
         strokeWidth={strokeWidth}
         fill={colors.fill}
         onClick={this.handleClick}
       />
    </svg>
  }
}

export default Connector;
