import React from 'react'

function Footer() {
    return (
        <div style={footerStyle}>HAW Hamburg AVPRG W19</div>
    );
}

const footerStyle = {
    width: '100%',
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    padding: '5px',
    background: 'var(--primary-shade3)',
    textAlign: 'right',
    fontSize: '10px',
    color: 'white'
}

export default Footer;
