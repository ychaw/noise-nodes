import React from 'react';

class Connector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      selection: [null, null],
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
    this.timerID = null;
  }

  componentDidMount() {
  }

  updatedSelectedState = () => {
    const isSelected = this.isSelected();
    this.setState({selected: isSelected})
    if(!isSelected) {
      clearInterval(this.timerID);
    }
  }

  handleClick = (e) => {
    const {id, type, audioNode} = this.props;
    this.props.select(id, type, audioNode);
    this.setState( (state, props) => {
      return {
        selected: this.isSelected(),
        selection: this.props.getSelection()
      }
    });
    setInterval(this.updatedSelectedState, 100);
  }

  getColors = () => {
    if(RegExp('audio-.*').test(this.props.type)) {
      return {stroke: 'var(--secondary1-shade1)', strokeActive: 'var(--secondary1-shade3)', fill: 'var(--secondary1-shade0)', fillActive: 'var(--secondary1-shade1)'}
    } else if(RegExp('control-.*').test(this.props.type)) {
      return {stroke: 'var(--secondary2-shade1)', strokeActive: 'var(--secondary2-shade3)', fill: 'var(--secondary2-shade0)', fillActive: 'var(--secondary2-shade1)'}
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

  isSelected = () => {
    const selection = this.props.getSelection();
    if(typeof selection != undefined) {
      for (let selected of selection.filter((element) => element !== null)) {
        return (this.props.id === selected.id) && (this.props.audioNode === selected.audioNode);
      }
    }
  }

  render() {
    let height = 65,
        width = 50,
        dim = 16,
        strokeWidth = dim/3 * 2,
        boundary = dim+strokeWidth,
        colors = this.getColors(),
        isInput = this.isInput();

    return <svg
      className={this.props.id}
      height={height}
      width={width}
      style={{cursor: 'pointer', position: 'relative', left: this.props.coordinates.x, top: this.props.coordinates.y}}
      >
      <circle
         cx={isInput ? boundary : width - boundary}
         cy={dim + strokeWidth}
         r={dim}
         stroke={this.state.selected ? colors.strokeActive : colors.stroke}
         strokeWidth={strokeWidth}
         fill={this.state.selected ? colors.fillActive : colors.fill}
         onClick={this.handleClick}
       />
    </svg>
  }
}

export default Connector;
