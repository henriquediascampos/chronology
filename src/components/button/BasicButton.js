import { Component } from '../../core/Component';
import { Theme } from '../../styles/theme';
import { RippleFocus } from '../ripple-focus/RippleFocus';
import { Ripple } from '../ripple/Ripple';

export class BasicButton extends Component {
  /**
   * @type {Theme}
   */
  theme = Theme.getInstance();

  /**
   * @param {ComponentProp} props
   */
  constructor(props) {
    super(props);

    this.theme.subscribe((theme) => {
      this.handleButton();
      this.stylesApply();
    });
  }

  /**
   * @param {string} color
   * @returns {import('../../core/AbstractTheme').ColorProp}
   */
  getColor(color) {
    let configColor = this.theme.getColor('#e0e0e0');

    if (color === 'primary') {
      configColor = this.theme.getPalette().primary;
    } else if (color?.match(/primary-[dark|light]/)) {
      const main = this.theme.getPalette().primary[color.split('-')[1]];
      configColor = this.theme.getColor(main);
    } else if (color === 'secondary') {
      configColor = this.theme.getPalette().secondary;
    } else if (color?.match(/secondary-[dark|light]/)) {
      const main = this.theme.getPalette().secondary[color.split('-')[1]];
      configColor = this.theme.getColor(main);
    } else if (color?.startsWith('#')) {
      configColor = this.theme.getColor(color);
    } else if (color === 'inherit') {
      return { contrastText: color, main: 'transparent' };
    } else if (color) {
      throw new Error(
        'Cor invalida, você pode optar por especificar os valore "primary", "secondary" ou uma cor no formado hexadecimal de 7digito (com #)',
      );
    }

    return configColor;
  }

  handleButton() {
    new Ripple({
      source: this.template,
      context: this,
    });
    new RippleFocus({
      source: this.template,
      context: this,
    });

    const color = this.template.getAttribute('color');

    const { main, light, dark, contrastText } = this.getColor(color);
    this.template.style.setProperty('--color-button', contrastText || '#000');
    this.template.style.setProperty('--background-button', main || '#f5f5f5');

    this.template.style.setProperty('--ripple-focus', light || '#f5f5f5');
    this.template.style.setProperty(
      '--background-button-hover',
      dark || '#333333',
    );
  }
}
