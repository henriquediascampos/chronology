import { Button } from "../components/button/Button";

/**
 *
 * @param {string} stringHtml
 * @returns {(Element|HTMLCollection)} - Um elemento único ou uma coleção de elementos.
 */
export function createElement(stringHtml) {
  const container = document.createElement("div");
  container.innerHTML = stringHtml;

  return container.children?.length > 1
    ? container.children
    : container.firstElementChild;
}

/**
 *
 * @param {HTMLElement} container
 * @param {HTMLElement|HTMLCollection} child
 */
export function appendChild(container, child) {
  if (child instanceof HTMLCollection) {
    container.append(...child);
  } else {
    container.appendChild(child);
  }
}

/**
 *
 * @param {HTMLElement|HTMLCollection} template
 */
export function render(context) {
  const { template } = context;
  const btns = Array.from(template.querySelectorAll("app-button"));

  btns.forEach((element) => {
    const appButton = Button(element, context);
    element.parentNode.replaceChild(appButton, element);
  });

  return template;
}
