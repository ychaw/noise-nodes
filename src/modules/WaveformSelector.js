import React from 'react';

class WaveformSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waveformIndex: 0};
    this.waveforms = ['sine', 'triangle', 'square', 'sawtooth'];
    this.vis = {
      r: 32,
      colors: this.getColors(),
    }
    this.vis.width = 2 * this.vis.r;
    this.vis.height = 2.5 * this.vis.r;
  }

  handleClick = (e) => {
    e.preventDefault();
    const newIndex = (this.state.waveformIndex + 1) % this.waveforms.length;
    this.setState( (state, props) => {
      this.props.changeWaveform(this.waveforms[newIndex]);
      return { waveformIndex: newIndex};
    });
  }

  displayWaveform = () => {
    const waveformPaths = {
        sine: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -32,0
            Q -16,-32 0,0
            M 0,0
            Q 16,32 32,0
          "
          />,
        triangle: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -32,0
            L -16,-16
            M -16,-16
            L 0,0
            M 0,0
            L 16,16
            M 16,16
            L 32,0
          "
          />,
        square: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -24,-16
            L 0,-16
            M 0,-16
            L 0,16
            M 0,16
            L 24,16
          "
          />,
        sawtooth: <path
            fill={'none'}
            stroke={'#fff'}
            strokeWidth={1.5}
            d="
            M -24,0
            L -24,-16
            M -24,-16
            L 24,16
            M 24,16
            L 24,0
            "
            />,
        };
    return waveformPaths[this.waveforms[this.state.waveformIndex]];
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

  render () {
    const {width, height, r, colors} = this.vis;
    return (
      <div id='WaveformSelector'>
        <svg
          width={width}
          height={height}
          onClick={this.handleClick}
          >
          <g
            transform={'translate(x y)'.replace('x', width/2).replace('y', height/2)}
            style={{cursor: 'pointer'}}
            >
            <circle
              style={{fill: colors[1]}}
              r={r}
              />
            {this.displayWaveform()}
          </g>
        </svg>
      </div>
    )

  }
}

export default WaveformSelector;
