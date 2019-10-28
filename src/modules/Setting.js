import React from 'react';

function Setting(props) {
    const {name, unit, changeValue, min, max, step, value} = props;
    return (
      <div>
        <p>{name}: {value} {unit}</p>
        <input type='range' min={min} max={max} step={step} value={value} onChange={changeValue}></input>
      </div>
    );
}

export default Setting;
