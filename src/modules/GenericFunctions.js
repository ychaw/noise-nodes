export default class GenericFunctions {
  static changeValue(value, target, param) {
      const relValue = value;
      let newObj = this.state[param.tag];
      newObj.relValue = relValue;
      this.setState({[param.tag]: newObj}, ()=> {
         //target.value = this.state[param.tag].absValue;
         target.linearRampToValueAtTime(this.state[param.tag].absValue, this.props.audioContext.currentTime + 0.1);
      });
    }

  static getColors() {
      if(this.props.type === 'audio') {
        return [
          'var(--secondary1-shade0)',
          'var(--secondary1-shade1)',
          'var(--secondary1-shade2)',
          'var(--secondary1-shade3)',
          'var(--secondary1-shade4)',
          'var(--secondary1-shade5)',
        ]
      } else if (this.props.type === 'control') {
        return [
          'var(--secondary2-shade0)',
          'var(--secondary2-shade1)',
          'var(--secondary2-shade2)',
          'var(--secondary2-shade3)',
          'var(--secondary2-shade4)',
          'var(--secondary2-shade5)',
        ]
      }
    }
}
