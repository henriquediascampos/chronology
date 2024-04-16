import { Component } from '../../core/Component';
import Tamplate from './Login.html';
import styles from './Login.css';

export class Login extends Component {
  /**
   * @param {Prop} prop
   */
  constructor(prop) {
    const { source, context } = prop || {};
    super({
      templateString: Tamplate,
      styles,
      source,
      context,
      noExternalComponents: true,
    });
  }
}
