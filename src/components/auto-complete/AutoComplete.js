import { createElement } from '../../core/component-factory.js';
import { Component } from '../../core/Component.js';
// import { Debounce } from '../debounce.js';
import Template from './AutoComplete.html';
import styles from './AutoComplete.css';
import { Input } from '../input/Input.js';

/**
 * Cria um botão HTML.
 * @param {HTMLInputElement} element - O icone.
 * @param {object} context - O icone.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class AutoComplete extends Component {
  /**
   * @type {HTMDivElement}
   */
  #input;

  constructor(element, context) {
    const templete = createElement(Template);
    super(templete, styles, [
      {
        ref: 'Input',
        type: Input,
      },
    ]);
    this.context = context;
    this.element = element;
    this.#input = this.template.querySelector('Input');

    console.log(this.#input);

    const variant = this.element.getAttribute('variant');

    if (!variant) {
      this.template.setAttribute('variant', 'outlined');
    }

    const label = element.getAttribute('label');
    if (!label) {
      throw new Error('o atributo "label é obrigatório"');
    }

    // this.#label.innerText = this.#input.placeholder = label;

    // this.#input.placeholder = element.getAttribute('placeholder') || label;

    // if (this.template.hasAttribute('required')) {
    //   this.template.classList.add('required');
    // }

    this.setAttributes(element, context, { class: 'class' }, this.#input);
  }

  onfocus(e) {
    console.log('onfocus', e);
  }
  oninput(e) {
    console.log('oninput', e);
  }
  onchange(e) {
    console.log('onchange', e);
  }
  onblur(e) {
    console.log('onblur', e);
  }
}
