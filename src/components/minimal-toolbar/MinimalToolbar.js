import { Component } from '../../core/Component';
import { navigate } from '../../utils/navigate';
import { AutoComplete } from '../auto-complete/AutoComplete';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { Input } from '../input/Input';
import styles from './MinimalToolbar.css';
import Template from './MinimalToolbar.html';

export class MinimalToolbar extends Component {
  iconTeste = 'remove';

  /**
   * @param {Prop} param0
   */
  constructor(props) {
    super({
      templateString: Template,
      styles,
      ...props,
      componentsRef: [
        {
          ref: 'btn',
          type: Button,
        },
        {
          ref: 'btn-icon',
          type: IconButton,
        },
        {
          ref: 'text-field',
          type: Input,
        },

        {
          ref: 'AutoComplete',
          type: AutoComplete,
        },
      ],
    });
  }

  search(value) {
    return ['giraffe', 'ducks', 'galinhas', 'cats', 'dogs', 'elephant'];
  }

  home() {
    navigate('home');
  }

  login() {
    navigate('login');
  }

  optionLabel = (option) => option;

  /**
   *
   * @param {string} option
   * @param {string} value
   * @returns {boolean}
   */
  filterHistorys = (option, value) => {
    return option.toUpperCase().includes(value.toUpperCase());
  };

  toggleMinimazeToolbar() {
    const collapsible = document.querySelector(
      `.${styles['collapsible-container']}`,
    );

    if (collapsible.classList.contains(styles.minimize)) {
      collapsible.classList.remove(styles.minimize);
      setTimeout(() => this.setState('iconTeste', 'remove'), 700);
    } else {
      collapsible.classList.add(styles.minimize);
      setTimeout(() => this.setState('iconTeste', 'add'), 700);
    }
  }
}
