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

  }

  render() {
    return super.render();
  }
}
