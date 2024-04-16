import { BasicComponent } from './BasicComponent';

export class ComponentTree {
  /**
   * @type {ComponentTree} Instância única da árvore de componentes
   */
  static instance = null;

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
   *
   * @param {Component} component
   * @param {ChildNode} node
   * @returns
   */
  buildTreeFromNode(node, component, componentName) {
    const props = Array.from(node?.attributes || []).reduce(
      (props, attribute) => {
        if (attribute.nodeValue.match(/^\{.+\}$/)) {
          const literalValue = attribute.nodeValue?.replace(/"|\{|\}/g, '');
          props[attribute.nodeName] = {
            literalValue,
            value: component[literalValue],
          };
        } else {
          props[attribute.nodeName] = {
            value: attribute.nodeValue,
          };
        }
        return props;
      },
      {},
    );

    // Include textContent as a prop if present
    if (
      node.textContent.trim() !== '' &&
      /(.*)(\{.+\})(.*)$/.test(node.textContent)
    ) {
      const integrateValue = node.textContent.replace(
        /(.*)(\{.+\})(.*)$/,
        '$2',
      );
      const literalValue = integrateValue.replace(/"|\{|\}/g, '');

      props['textContent'] = {
        textContent: node.textContent,
        integrateValue,
        literalValue,
        value: component[literalValue],
      };
    }

    const children = Array.from(node?.children || []).map((n) =>
      this.buildTreeFromNode(n, component),
    );

    /** @property {Tree} */
    const newTree = {
      type: node?.tagName.toLowerCase(),
      element: node,
      props,
      children,
    };

    const ref = component.componentsRef?.find(
      (c) => c.ref.toLowerCase() === node?.tagName.toLowerCase(),
    );
    if (componentName || ref) {
      newTree.componentName = componentName || ref.type?.name;
    }

    return newTree;
  }

  /**
   * @param {Tree} tree
   * @param {BasicComponent} component
   */
  diff(tree, component) {
    for (const prop in tree.props) {
      const property = tree.props[prop];

      if (property.literalValue) {
        const componentePropvalue = component[property.literalValue];

        if (property.value !== componentePropvalue) {
          property.value = componentePropvalue;
          if (tree.updateEvent) {
            const event = new CustomEvent(tree.updateEvent, {
              detail: {
                stateName: prop,
                stateValue: componentePropvalue,
                literalValue: property.literalValue,
              },
            });

            tree.elementRender?.dispatchEvent(event);
          } else {
            this.reconciliation(prop, tree);
          }
        }
      }
    }

    for (const child of tree.children) {
      this.diff(child, component);
    }
  }

  /**
   * @param {Tree} tree
   */
  reconciliationAll(tree) {
    for (const prop in tree.props) {
      this.reconciliation(prop, tree);
    }

    for (const child of tree.children) {
      this.reconciliationAll(child);
    }
  }

  /**
   * @param {string} prop
   * @param {Tree} value
   */
  reconciliation(prop, tree) {
    if (prop === 'textContent') {
      tree.element.textContent = tree.props[prop].textContent.replaceAll(
        tree.props[prop].integrateValue,
        tree.props[prop].value,
      );
    } else if (tree.element?.hasAttribute(prop)) {
      tree.element.setAttribute(prop, tree.props[prop].value);
    }
  }

  /**
   *
   * @param {Tree} tree
   * @param {Element} customElement
   * @param {string} eventName
   * @param {HTMLElement} elementRender
   */
  setUpdateEvent(tree, customElement, eventName, elementRender) {
    if (tree.element === customElement) {
      tree.updateEvent = eventName;
      tree.elementRender = elementRender;
      return;
    }

    for (const child of tree.children) {
      this.setUpdateEvent(child, customElement, eventName, elementRender);
    }
  }
}
