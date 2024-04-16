import { Component } from '../../core/Component';
import { BasicButton } from '../button/BasicButton';
import { Icon } from '../icon/Icon';
import styles from './IconButton.css';
import Template from './IconButton.html';

const IconButtonProps = Object.freeze({
  ONCLICK: 'onclick',
  BG_COLOR: 'bgColor',
  CLASS: 'class',
  ELEVATION: 'elevation',
});

/**
 * Cria um botão HTML.
 * @param {HTMLButtonElement} element - O icone.
 * @param {object} context - O icone.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class IconButton extends BasicButton {
  /** @type {HTMLButtonElement} btn */

  /**
   * @param {Prop & { iconName: string, adornment: 'start'|'end'}} param0
   */
  constructor({ iconName, adornment, ...props }) {
    super({
      templateString: Template,
      styles,
      ...props,
      noExternalComponents: true,
    });

    //atribuições
    this.attributes = this.source?.getAttributeNames();
    this.functions = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this.context),
    );
    this.props = Object.getOwnPropertyNames(this.context);

    //start da logica
    this.validate(this.context);
    this.setOnclick();

    this.setAttributes({
      specificPropsToIgnore: Object.values(IconButtonProps),
    });

    const textIcon = this.source?.textContent || iconName;
    const icon = new Icon({
      source: this.template,
      context: this,
      value: textIcon,
    }).render();
    this.template.append(icon);

    this.handleButton();
    this.stylesApply();
    this.adornment(adornment);
  }

  /**
   *
   * @param {'start' | 'end'} adornment
   */

  adornment(type) {
    if (type) {
      this.template.classList.add(this.styles[`${type}-adornment`]);
    }
  }

  /**
   *
   * @param {Function} action
   */
  setOnclick(action) {
    if (action) {
      this.template.addEventListener('click', (e) => action(''));
    }

    if (this.source?.hasAttribute('onclick')) {
      const functionName = this.getFunctionName('onclick');
      this.setEvent(functionName, 'click', this.template);
    }
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
    super.handleButton();
    const color = this.template.getAttribute('color');

    if (!color) {
      this.template.style.setProperty('--background-button', 'trasparent');
    }

    if (this.source.hasAttribute('elevation')) {
      this.template.classList.add(styles.elevation);
    }
  }

  textContent(value) {
    const icon = new Icon({
      source: this.template,
      context: this,
      value: value,
    }).render();

    this.template.querySelector('.material-symbols-outlined').replaceWith(icon);

    // icon.classList.add(styles.opacity);
    // Array.from(
    //   this.template.querySelectorAll('.material-symbols-outlined'),
    // ).forEach((oldIcon) => {
    //   oldIcon.classList.add(styles.opacity);
    //   setTimeout(() => {
    //     oldIcon.remove();
    //   }, 180);
    // });

    // this.template.appendChild(icon);
    // setTimeout(() => {
    //   icon.classList.remove(styles.opacity);
    // }, 120);
  }
}
