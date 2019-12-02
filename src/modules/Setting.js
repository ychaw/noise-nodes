import React from 'react';

function Setting(props) {
    //const {name, unit, changeValue, min, max, step, value} = props;
    const {name, unit, changeValue, value} = props;
    return (
      <div style={style}>
        <p>{name}: {Number(Number(value).toPrecision(2))} {unit}</p>
        <input type='range' min={0} max={1} step={0.01} onChange={changeValue}></input>
      </div>
    );
}

const style = {
  color: '#fff',
}

export default Setting;
