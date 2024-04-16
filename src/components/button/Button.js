import { Icon } from '../icon/Icon';
import { BasicButton } from './BasicButton';
import styles from './Button.css';
import Template from './Button.html';

const ButtonProps = Object.freeze({
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
export class Button extends BasicButton {
  /** @type {HTMLButtonElement} btn */

  constructor(props) {
    super({
      templateString: Template,
      styles,
      ...props,
      noExternalComponents: true,
    });

    //atributos
    this.attributes = this.source.getAttributeNames();

    //start da logica
    this.validate(this.context);
    this.setAttributes({ specificPropsToIgnore: Object.values(ButtonProps) });

    if (this.source.hasAttribute(ButtonProps.START_ICON)) {
      const textIcon = this.source.getAttribute(ButtonProps.START_ICON);
      const icon = new Icon({
        source: this.template,
        context: this,
        value: textIcon,
      }).render();

      this.template.append(icon);
      this.template.classList.add('start-adornment');
    }
    this.template.append(...this.source.childNodes);

    if (this.source.hasAttribute(ButtonProps.END_ICON)) {
      const textIcon = this.source.getAttribute(ButtonProps.START_ICON);
      const icon = new Icon({
        source: this.template,
        context: this,
        value: textIcon,
      }).render();

      this.template.append(icon);
      this.template.classList.add('end-adornment');
    }

    this.handleButton();
    this.stylesApply();
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
}
