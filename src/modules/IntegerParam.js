class IntegerParam {
  constructor(tag, abs, min, max) {
    this.tag = tag;
    this.min = min;
    this.max = max;
    this._relValue = this.fromAbsToRel(abs);
    this._absValue = Math.round(abs);
  }

  set relValue(newValue) {
    this._relValue = newValue;
    this._absValue = this.fromRelToAbs(newValue);
  }

  set absValue(newValue) {
    this._absValue = Math.round(newValue);
    this._relValue = this.fromAbsToRel(newValue);
  }

  get relValue() {
    return this._relValue;
  }

  get absValue() {
    return this._absValue;
  }

  fromRelToAbs = (rel) => {
    return Math.round((this.max - this.min) * rel + this.min);
  }

  fromAbsToRel = (abs) => {
    let rel = (abs - this.min) / (this.max - this.min);
    return rel;
  }
}

export default IntegerParam;
