import React from 'react';

class Pallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } 

    render() {
        return (
            <div style={palletStyle}>
                <PalletItem type='OSC' />
                <PalletItem type='GAIN' />
                <PalletItem type='FILTER' />
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
            <button className='palletItemPlaceholder' style={palletItemStyle}>
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
}

export default Pallet;