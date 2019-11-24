import React from 'react';

function Header() {
    return (
       <header style={headerStyle}>
            <div style={headerItemStyle}>
                <h1>NoiseNodes</h1>
            </div>
            <div style={{...headerItemStyle,...aboutStyle}}>
                <h2>About</h2>
            </div>
        </header>
    )
}

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--primary-shade3)',
    border: '1px solid black',
    color: 'white',
}

const headerItemStyle = {
    flexBasis: '250px',
    background: 'var(--primary-shade4)',
}

const aboutStyle = {
    // alignSelf: 'stretch',
    // alignContent: 'center',
    // flexShrink: '1',
 }

export default Header;
