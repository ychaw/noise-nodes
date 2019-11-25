import React from 'react';

function Setting(props) {
    //const {name, unit, changeValue, min, max, step, value} = props;
    const {name, unit, changeValue, value} = props;
    return (
      <div>
        <p>{name}: {value} {unit}</p>
        <input type='range' min={0} max={1} step={0.01} value={value} onChange={changeValue}></input>
      </div>
    );
}

export default Setting;
