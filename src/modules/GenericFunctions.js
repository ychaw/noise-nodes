export default class GenericFunctions {
  static changeValue(value, target, param) {
      const relValue = value;
      let newObj = this.state[param.tag];
      newObj.relValue = relValue;
      this.setState({[param.tag]: newObj}, ()=> {
        target.value = this.state[param.tag].absValue;
      });
    }
}
