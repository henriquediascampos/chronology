import { createElement } from "../../utils/component-factory";
import Template from "./Icon.html";

/**
 * Cria um botão HTML.
 * @param {Object} props - Os parâmetros do botão.
 * @param {string} props.value - Texto a ser exibido no botão.
 * @returns {HTMLSpanElement} - O botão HTML criado dinamicamente.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export function Icon({ value }) {
  if (!value) {
    throw new Error("o parametro label são obrigatórios");
  }

  /** @type {HTMLSpanElement} btn */
  const template = createElement(Template);

  template.innerText = value;
  template.classList.add('material-symbols-outlined');
  return template;
}
