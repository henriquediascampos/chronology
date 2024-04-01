/**
 *
 * @typedef {object} ComponentItem
 * @property {string} id
 * @property {string} idParent
 * @property {BasicComponent} component
 * @property {Object.<string, ComponentItem>} childrens
 */

import { BasicComponent } from './BasicComponent';

export class ComponentTree {
  /**
   * @type {ComponentTree} Instância única da árvore de componentes
   */
  static instance = null;

  /**
   * @type {Object.<string, ComponentItem>} Mapeamento de IDs de componentes para instâncias de BasicComponent
   */
  componentMap = (this.componentMap = {
    start: 'root',
    childrens: {},
  });

  constructor() {
    if (!ComponentTree.instance) {
      ComponentTree.instance = this;
    }
    return ComponentTree.instance;
  }

  /**
   * Retorna a instância única da árvore de componentes.
   * @returns {ComponentTree} Instância única da árvore de componentes
   */
  static getInstance() {
    if (!ComponentTree.instance) {
      ComponentTree.instance = new ComponentTree();
    }
    return ComponentTree.instance;
  }

  /**
   * Registra um componente na árvore de componentes.
   * @param {BasicComponent} component Instância do componente a ser registrado
   */
  registerComponent(component) {
    const id = component.id;
    const idParent = component.context?.id;
    const parent = this.findParentComponent(idParent);
    const exists = parent?.childrens[id];

    if (exists) {
      parent.childrens[id] = Object.assign(component, exists);
    } else if (parent) {
      parent.childrens[id] = {
        id,
        component,
        idParent,
        childrens: {},
      };
    } else {
      this.componentMap.childrens[id] = {
        component,
        childrens: {},
      };
    }
  }

  /**
   * Encontra o componente pai do componente atual na árvore de componentes.
   * @param {string} __id Instância do componente cujo pai será procurado
   * @returns {ComponentItem|null} Instância do componente pai, ou null se não for encontrado
   */
  findParentComponent(__id) {
    if (__id) {
      return this.find(this.componentMap, __id);
    }

    return null;
  }

  /**
   *
   * @param {ComponentItem} obj
   * @param {string} __id
   * @returns {ComponentItem}
   */
  find(obj, __id) {
    for (const id of Object.keys(obj.childrens)) {
      const parentCandidate = obj.childrens[id];

      if (id === __id) {
        return parentCandidate;
      } else {
        const children = this.find(parentCandidate, __id);
        if (children) {
          return children;
        }
      }
    }
  }

  /**
   * Obtém um componente da árvore de componentes pelo seu ID.
   * @param {string} id ID do componente a ser obtido
   * @returns {ComponentItem} Instância do componente correspondente ao ID fornecido
   */
  getComponentById(id) {
    return this.find(this.componentMap, id);
  }

  notifyStateChange(component, propName) {
    const teste = this.getComponentById(component.id);
    teste.component.update();

    // Verifica se há componentes afetados por essa alteração de estado
    // e reage a essa alteração conforme necessário
  }
}
