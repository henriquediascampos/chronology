import { Component } from '../../core/Component';
import styles from './Home.css';
import Tamplate from './Home.html';
import { Input } from '../../components/input/Input';
import { IconButton } from '../../components/icon-button/IconButton';
export class Home extends Component {
  valueState = '';
  iconBtn = 'clear';
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
        {
          ref: 'iconbutton',
          type: IconButton,
        },
      ],
    });

    this.template.querySelector('[teste]')?.addEventListener('input', (e) => {
      this.setState('valueState', e.target.value);
    });

    setTimeout(() => {
      // this.updateState('valueState', 'ovo');
      // console.log('state:', this.valueState);
    }, 1000);
  }

  render() {
    return super.render();
  }

  toggle() {
    if (this.iconBtn !== 'home') {
      this.setState('iconBtn', 'home');
    } else {
      this.setState('iconBtn', 'clear');
    }
  }
}
