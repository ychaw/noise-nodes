import React from 'react';

class Pallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          displaying: false,
        };
    }

    toggleNodeHandlerDisplay = (e) => {
      e.preventDefault();
      this.setState({
        displaying: !this.state.displaying,
      });
      this.forceUpdate();
    }

    render() {
      const types = ['OSC', 'GAIN', 'FILTER', 'LFO', 'ENV', 'SEQ'],
            palletItems = [];

        for (var i = 0; i < types.length; i++) {
          palletItems.push(<PalletItem key={i} type={types[i]} createNodeHandlers={this.props.createNodeHandlers}/>);
        }

        return (
            <div style={palletStyle} onClick={this.toggleNodeHandlerDisplay}>
                <button style={palletItemStyle} onClick={this.toggleNodeHandlerDisplay}>+</button>
                {this.state.displaying ? palletItems : null}
            </div>
        );
    }
}

class PalletItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {type: this.props.type};
    }

    render() {
      return (
        <button onClick={this.props.createNodeHandlers[this.state.type]} style={{...palletItemStyle}}>
          {this.state.type}
        </button>
        );
    }
}

const palletStyle = {
    position: 'fixed',
    top: '75px',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-around',
    background: 'var(--primary-shade3)',
}

const palletItemStyle = {
    flexBasis: '55px',
    border: 'none',
    padding: '8px 15px 6px',
    background: 'var(--primary-shade2)',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
}

export default Pallet;
