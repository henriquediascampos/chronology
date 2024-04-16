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
