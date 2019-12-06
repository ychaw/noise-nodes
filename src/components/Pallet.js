import React from 'react';

class Pallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={palletStyle}>
                <PalletItem type='OSC' createNodeHandlers={this.props.createNodeHandlers}/>
                <PalletItem type='GAIN' createNodeHandlers={this.props.createNodeHandlers}/>
                <PalletItem type='FILTER' createNodeHandlers={this.props.createNodeHandlers}/>
                <PalletItem type='LFO' createNodeHandlers={this.props.createNodeHandlers}/>
                <PalletItem type='ENV' createNodeHandlers={this.props.createNodeHandlers}/>
                <PalletItem type='SEQ' createNodeHandlers={this.props.createNodeHandlers}/>
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
            <button onClick={this.props.createNodeHandlers[this.state.type]} style={palletItemStyle}>
                {this.state.type}
            </button>
        );
    }
}

const palletStyle = {
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-around',
    padding: '20px',
    background: 'var(--primary-shade3)',
}

const palletItemStyle = {
    flexBasis: '55px',
    padding: '5px',
    background: 'var(--primary-shade2)',
    border: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
}

export default Pallet;
