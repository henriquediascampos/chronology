import { Component } from '../../core/Component';
import styles from './Home.css';
import Tamplate from './Home.html';
import { Input } from '../../components/input/Input';
export class Home extends Component {
  valueState = '';

  /**
   *
   * @param {Prop} props
   */
  constructor(props) {
    super({
      templateString: Tamplate,
      styles,
      ...props,
      componentsRef: [
        {
          ref: 'textInput',
          type: Input,
        },
      ],
    });

    this.template.querySelector('[teste]').addEventListener('input', (e) => {
      this.setState('valueState', e.target.value);
      console.log('input:', this.valueState);
    });

    setTimeout(() => {
      // this.updateState('valueState', 'ovo');
      // console.log('state:', this.valueState);
    }, 1000);
  }

  render() {
    console.log('state:', this.valueState);
    return super.render();
  }
}
