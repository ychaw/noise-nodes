import React from 'react'

class SequencerNodeButtons extends React.Component {

  getButtons = () => {
    const r = 8,
        stroke = 6,
        bounds = r + stroke,
        rowLength = 8,
        leftOffset = 10,
        rowOffsetDistance = 2.5 * bounds,
        rowCount = Math.ceil(this.props.beats.absValue / rowLength),
        buttons = [],
        colors = ['var(--secondary2-shade1)', 'var(--secondary2-shade3)'];


    let currentRow = 0,
        buttonsLeft = this.props.beats.absValue;

    while (currentRow < rowCount) {
      let currentRowLength = (buttonsLeft > rowLength ? rowLength : buttonsLeft);
        for (var xOffset = 0; xOffset < currentRowLength; xOffset++) {
          let betweenDistance = xOffset > 0 ? 8 : 0,
              key = (xOffset + currentRow * rowLength); // use absolute button number as key
          buttons.push(
            <circle
            cx={bounds + (2*bounds + betweenDistance) * xOffset + leftOffset}
            cy={bounds + (currentRow * rowOffsetDistance)}
            r={r}
            fill={colors[0]}
            stroke={this.props.active[key] ? colors[1] : colors[0]}
            strokeWidth={stroke}
            key={key.toString()}
            onClick={this.props.onClick.bind(this, key)}
            />);
        }

        buttonsLeft -= rowLength;
        currentRow++;
    }
    return (
      <svg display='inline' onClick={this.props.onClick}>
        {buttons}
      </svg>
    )
  }

  render () {
    return (
      <div>
        {this.getButtons()}
      </div>
    )
  }
}

export default SequencerNodeButtons;
