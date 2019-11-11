import React from 'react'

function Footer() {
    return (
        <div style={footerStyle}>HAW Hamburg AVPRG W19</div>
    );
}

const footerStyle = {
    padding: '5px',
    background: 'var(--primary-shade3)',
    textAlign: 'right',
    fontSize: '10px',
    color: 'white'
}

export default Footer;