import template from './Toolbar.html';
import styles from './Toolbar.css';
import { Button } from '../button/Button';
import { Input } from '../input/Input';
import { Component } from '../../core/Component';
import { IconButton } from '../icon-button/IconButton';

export class Toolbar extends Component {
  /**
   *
   * @param {Prop} props
   */
  constructor(props) {
    super({
      ...props,
      templateString: template,
      styles,
      componentsRef: [
        {
          ref: 'app-button',
          type: Button,
        },
        {
          ref: 'input-custom',
          type: Input,
        },
        {
          ref: 'mini-miza',
          type: IconButton,
        },
      ],
    });
  }
}
