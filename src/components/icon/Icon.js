import { Component } from "../../core/Component";
import { createElement } from "../../core/component-factory";
import Template from "./Icon.html";

/**
 * Cria um botão HTML.
 * @param {Object} props - Os parâmetros do botão.
 * @param {string} props.value - Texto a ser exibido no botão.
 * @returns {HTMLSpanElement} - O botão HTML criado dinamicamente.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class Icon extends Component {

  constructor({value}) {
  
    /** @type {HTMLSpanElement} btn */
    const tamplate = createElement(Template);
    super(tamplate, null, null, true);
    
    if (!value) {
      throw new Error("o parametro label são obrigatórios");
    }

    this.template.innerText = value;
    this.template.classList.add('material-symbols-outlined');
  }
}
