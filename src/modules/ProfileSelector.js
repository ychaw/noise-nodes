import React from 'react';

class ProfileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileIndex: 0};
    this.profiles = ['lowpass', 'highpass', 'bandpass'];
    this.vis = {
      r: 32,
      colors: this.getColors(),
    }
    this.vis.width = 2 * this.vis.r;
    this.vis.height = 2.5 * this.vis.r;
  }

  handleClick = (e) => {
    e.preventDefault();
    const newIndex = (this.state.profileIndex + 1) % this.profiles.length;
    this.setState( (state, props) => {
      this.props.changeProfile(this.profiles[newIndex]);
      return { profileIndex: newIndex};
    });
  }

  displayProfile = () => {
    const waveformPaths = {
        lowpass: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -30,-8
            Q 0,-8 0,-8
            M 0,-8
            Q 16,-8 28,16
          "
          />,
        highpass: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -30,8
            Q -16,-8 0,-8
            M 0,-8
            Q 16,-8 28,-8
          "
          />,
        bandpass: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -30,8
            Q -16,-8 0,-8
            M 0,-8
            Q 16,-8 30,8
          "
          />,
        notch: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
            M -32,0
            Q 0,0 0,32
            M 0,32
            Q 0,0 32,0
          "
          />,
        allpass: <path
          fill={'none'}
          stroke={'#fff'}
          strokeWidth={1.5}
          d="
          M -32,0
          Q -16,32 0,0
          M 0,0
          Q 16,-32 32,0
          "
          />,
        };
    return waveformPaths[this.profiles[this.state.profileIndex]];
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
      <div id='profileselector'>
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
            {this.displayProfile()}
          </g>
        </svg>
      </div>
    )

  }
}

export default ProfileSelector;
