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
    display: 'flex',
    background: '#123649',
    border: '1px solid black'
}

const titleStyle = {
    padding: '10px',
    background: '#042130',
    color: 'white'
}
const aboutStyle = {
    padding: '20px',
    background: '#042130',
    color: 'white'
 }

export default Header;
