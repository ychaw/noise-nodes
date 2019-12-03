import React from 'react';

function Setting(props) {
    const {name, unit, value} = props;
    const changeValue = (e) => {
      props.changeValue(e, props.target, props.value);
    }
    return (
      <div style={style}>
        <p>{name}: {Number(Number(value.absValue).toPrecision(2))} {unit}</p>
        <input type='range' min={0} max={1} step={0.01} value={value.relValue} onChange={changeValue}></input>
      </div>
    );
  }
}

const style = {
  color: '#fff',
}

export default Setting;
