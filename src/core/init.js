import { AbstractTheme } from './AbstractTheme';
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
