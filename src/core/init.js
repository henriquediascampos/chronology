import { AbstractTheme } from './AbstractTheme';
import { ComponentTree } from './ComponentTree';
import { appendChild } from './component-factory';

/**
 *
 * @param {HTMLElement} app
 * @param {AbstractTheme} theme
 */
export function init(app, theme) {
  theme.setTheme('light');

  const root = document.querySelector('#root');
  appendChild(root, app);
}
