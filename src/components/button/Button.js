import Template from './Button.html';
import styles from './Button.css';
import { createElement } from '../../core/component-factory';
import { Component } from '../../core/Component';
import { Ripple } from '../ripple/Ripple';
import { Icon } from '../icon/Icon';

const BUTTON_PROPS = Object.freeze({
  ONCLICK: 'onclick',
  START_ICON: 'startIcon',
  END_ICON: 'endIcon',
  BG_COLOR: 'bgColor',
  CLASS: 'class',
});

/**
 * Cria um botão HTML.
 * @param {HTMLButtonElement} element - O icone.
 * @param {object} context - O icone.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class Button extends Component {
  /** @type {HTMLButtonElement} btn */

  constructor(element, context) {
    const template = createElement(Template);
    super(template, null, null, true);

    //atribuições
    this.attributes = element.getAttributeNames();
    this.functions = Object.getOwnPropertyNames(Object.getPrototypeOf(context));
    this.props = Object.getOwnPropertyNames(context);
    this.context = context;
    this.element = element;

    //start da logica
    this.validate(context);
    this.setAttributes(this.element, this.context, BUTTON_PROPS);

    if (element.hasAttribute(BUTTON_PROPS.START_ICON)) {
      const textIcon = element.getAttribute(BUTTON_PROPS.START_ICON);
      const icon = new Icon({ value: textIcon }).render();

      this.template.append(icon);
      this.template.classList.add('start-adorment');
    }
    this.template.append(...element.childNodes);

    if (element.hasAttribute(BUTTON_PROPS.END_ICON)) {
      const textIcon = element.getAttribute(BUTTON_PROPS.START_ICON);
      const icon = new Icon({ value: textIcon }).render();

      this.template.append(icon);
      this.template.classList.add('end-adorment');
    }

    this.handleButton();
    this.styles = styles;
    this.stylesApplay(template, styles);
  }

  validate() {
    if (this.functions.some((fn) => this.props.includes(fn))) {
      const duplicated = this.functions.filter((fn) => this.props.includes(fn));
      throw new Error(
        `Você não pode ter functione propriedades com mesmo nome em sua classe [${
          this.context.constructor.name
        }]. \n Considere renomear a(s) funçõe(s) ou atributo(s): ${duplicated.join(
          ',',
        )}`,
      );
    }
  }

  handleButton() {
    new Ripple(this.template, this);
    const color = this.template.getAttribute('color');
    const bgColor = this.template.getAttribute('bgcolor');
    this.template.style.setProperty('--color-fill', color || '#000');
    this.template.style.color = color;
    this.template.style.backgroundColor = bgColor;
  }
}
