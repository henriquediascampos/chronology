import { Component } from "./Component";

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
 * @param {Component} context
 */
export function render(context) {
  const { template, componentsRef } = context;
  componentsRef?.forEach((component) => {
    const customTag = Array.from(template.querySelectorAll(component.ref));

    customTag.forEach((element) => {
      const newComponent = new component.type(element, context);
      element.parentNode.replaceChild(newComponent.render(), element);
    });
  });

  return template;
}
