import { Theme } from '../styles/theme';
import { AbstractTheme } from './AbstractTheme';
import { ComponentTree } from './ComponentTree';
import '../utils/types';
import { Component } from './Component';

export class BasicComponent {
  /**
   * @type {string} ID único do componente
   */
  id;

  /**
   * @type {Element} html do componente
   */
  template;

  /**
   * @type {string} string do html do componente
   */
  templateString;

  /**
   * @type {object} objeto modularizado do css
   */
  styles;

  /**
   * @type {Component} context this do parent onde esse componente foi chamado
   */
  context;

  /**
   * @type {Element} html do parent onde esse componente foi chamado
   */
  source;

  /**
   *
   * @type  {Array.<ComponentRef>} array de referencias dos componente utilizados neste componente
   */
  componentsRef;

  /**
   *
   * @param {string} templateString html do seu componente.
   * @param {object} styles objeto styles, importação do seu css, simplimente import seu css e jogue a variavel aqui.
   * @param {Component} source elemento origem, tag do existente no compoente pai que será substituida por este componente
   * @param {Component} context componete pai onde este component este sendo rederizado
   * @param {Array.<ComponentRef>}  componentsRef se voce tiver dependencias, ou seja, se vc utiliza neste componente, componentes externos vece deve declarar aqui.
   */
  constructor(prop) {
    const { templateString, styles, source, context, componentsRef } = prop;
    this.templateString = templateString;
    this.originalTemplate = this.createElement(templateString);
    this.template = this.originalTemplate.cloneNode(true);

    this.styles = styles;
    this.source = source;
    this.context = context;
    this.componentsRef = componentsRef;
    const prefix = this.constructor.name.toLowerCase();
    this.id =
      prop?.id || `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
  }

  stylesApply() {
    Object.keys(this.styles).forEach(
      function (cssClassName) {
        if (this.template.classList.contains(cssClassName)) {
          this.template.classList.replace(
            cssClassName,
            this.styles[cssClassName],
          );
        }

        const elements = this.template?.getElementsByClassName(cssClassName);
        if (elements) {
          Array.from(elements).forEach(
            function (element) {
              element.classList.replace(
                cssClassName,
                this.styles[cssClassName],
              );
            }.bind(this),
          );
        }
      }.bind(this),
    );
  }

  /**
   *
   * @param {string} stringHtml
   * @returns {(Element|HTMLCollection)} - Um elemento único ou uma coleção de elementos.
   */
  createElement(stringHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.templateString, 'text/html');
    return doc.body.firstChild;
  }

  /**
   *
   * @returns {Element}
   */
  render() {
    if (this.styles) {
      this.stylesApply();
    }

    const tree = ComponentTree.getInstance();

    this.nodeTree = tree.buildTreeFromNode(this.template, this, this.id);
    tree.reconciliationAll(this.nodeTree);

    this.componentsRef?.forEach((component) => {
      const customTag = Array.from(
        this.template.querySelectorAll(component.ref),
      );

      customTag.forEach((element) => {
        const newComponent = new component.type({
          source: element,
          context: this,
        });
        /**@type {BasicComponent} */
        const newElement = newComponent.render();

        // element.parentNode.replaceChild(newElement, element);

        element.replaceWith(newElement);
        tree.setUpdateEvent(
          this.nodeTree,
          element,
          newComponent.id,
          newElement,
        );

        newComponent.triggerUpdate();
      });
    });

    this.template.setAttribute(this.id, '');
    this.template.setAttribute('component', this.id);

    // if (this.constructor.name === 'Home') {
    //   console.log(this.nodeTree);
    // }

    return this.template;
  }

  /**
   * Atualiza manualmente o componente.
   */
  reBuild() {
    const root = this.template.parentNode;
    const newComponent = new this.constructor({
      source: root,
      context: this.context,
      compoentId: this.id,
      updateState: true,
    });

    const newTemplate = newComponent.render();
    root.replaceChild(newTemplate, this.template);
  }

  /**
   * Atualiza o estado do componente e notifica o gerenciador de estado sobre a mudança.
   * @param {string} propName Nome da propriedade de estado a ser atualizada
   * @param {any} value Novo valor do estado
   */
  async setState(propName, value) {
    if (this[propName] instanceof Function) {
      this[propName](value);
      ComponentTree.getInstance().diff(this.nodeTree, this);
    } else {
      this[propName] = value;
      ComponentTree.getInstance().diff(this.nodeTree, this);
    }
  }

  /**
   *
   * @param {Event} event
   */
  triggerUpdate() {
    this.template.addEventListener(this.id, (e) => {
      const { stateName, stateValue, literalValue } = e.detail;
      this.setState(stateName, stateValue);
    });
  }
}
