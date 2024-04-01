import { Component } from '../core/Component.js';
import { appendChild } from '../core/component-factory.js';
import TemplateString from './Router.html';

/**
 * @typedef {Array.<Object>} Route
 * @property {string} path - Indicates whether the Courage component is present.
 * @property {Function} navigate - Indicates whether the Power component is present.
 */

export class Router extends Component {
  /**
   * @type {Route}
   */
  #routes = [
    {
      path: 'home',
      /**
       * @param {Prop} props
       * @returns {Component} page component
       */
      navigate: (props) =>
        import('../pages/home/Home.js').then(
          (module) => new module.Home(props),
        ),
    },
    {
      path: 'login',
      /**
       * @param {Prop} props
       * @returns {Component} page component
       */
      navigate: (props) =>
        import('../pages/login/Login.js').then(
          (module) => new module.Login(props),
        ),
    },
  ];

  #curretRoute = '';

  /**
   *
   * @param {Prop} props
   */
  constructor(props) {
    super({
      templateString: TemplateString,
      ...props,
      noExternalComponents: true,
    });

    window.location.hash = window.location.hash || 'home';

    this.handleRoute(window.location.hash);

    window.addEventListener('hashchange', () => {
      this.handleRoute(window.location.hash);
    });
  }

  handleRoute(path) {
    if (this.#curretRoute !== path) {
      this.#curretRoute = path;
      const _path = path.startsWith('#') ? path.slice(1) : path;
      const route = this.#routes.find((r) => r.path === _path);
      if (!route) {
        throw new Error(`Rota [${path}] não encontrada!!!`);
      }
      this.template.innerHTML = '';

      route
        .navigate({ source: this.template, context: this })
        .then((module) => {
          appendChild(this.template, module.render());
        });
    }
  }
}
