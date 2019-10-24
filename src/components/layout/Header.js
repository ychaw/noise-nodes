import React from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>NoiseNodes</h1>
            <h2 style={aboutStyle}>About</h2>
        </header>
    )
}

const headerStyle = {
    display: 'block',
    background: '#123649',
    border: '1px solid black'
}

const titleStyle = {
    display: 'inline',
    background: '#042130',
    color: 'white'
}
const aboutStyle = {
    display: 'inline',
    background: '#042130',
    color: 'white'
 }

export default Header;
