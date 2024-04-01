import { Component } from '../../core/Component';
import Template from './Icon.html';
import '../../utils/types';
/**
 *
 * Cria um botão HTML.
 * @param {Object} props - Os parâmetros do botão.
 * @param {string} props.value - Texto a ser exibido no botão.
 * @returns {HTMLSpanElement} - O botão HTML criado dinamicamente.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class Icon extends Component {
  /**
   * @param {(Prop & {value: string})} props
   */
  constructor({ value, ...props }) {
    super({
      ...props,
      templateString: Template,
      noExternalComponents: true,
    });

    if (!value) {
      throw new Error('o parametro label são obrigatórios');
    }

    this.template.innerText = value;
    this.template.classList.add('material-symbols-outlined');
  }
}
