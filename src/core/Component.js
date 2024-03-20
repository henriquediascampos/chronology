import { checkDuplicatedValue } from '../utils/Array-utils';
import { render } from './component-factory';

export class Component {
  /**
   * @typedef ComponentRef
   * @type {object}
   * @property {Component} type class/construtor do compoente
   * @property {string} ref tagname utilizada nesse contexto
   *
   * @type  {Array.<ComponentRef>}
   */
  componentsRef;

  noExternalComponents = false;

  /**
   * @type {Element}
   */
  template;

  /**
   *
   * @param {Element} template
   * @param {Array.<ComponentRef>}  componentsRef
   * @param {boolean} noExternalComponents
   */
  constructor(template, styles, componentsRef, noExternalComponents) {
    this.template = template;
    this.styles = styles;
    this.componentsRef = componentsRef;
    this.noExternalComponents = noExternalComponents;

    if (!this.template) {
      throw new Error(
        'Você não definiu template para seu componente! Importe seu html e use a função createElement de `component-factory` e passe seu string-html para criar seu template.',
      );
    }

    if (template instanceof HTMLCollection) {
      throw new Error(`O tamplate de  ${this.constructor.name} é um "HTMLCollection" verifique o arquivo html de seu componente. Você não deve ter seu tamplate desta forma!!! 
        Tenha sempre uma tag única para retornar, ex.: Encapsule todo seu html em um div para retorar uma div unica.`);
    }

    if (!this.noExternalComponents && !this.componentsRef?.length) {
      throw new Error(`Você não definiu nenhuma referencia para seu componente ${this.constructor.name}!!!
          se você estiver usando componentes externos a ${this.constructor.name}, você deve definir as referencias dos mesmos na variável componentsRef
          ex: 
            constructor() {
              this.componentsRef = [
                {
                  type: Button,
                  ref: 'app-button'
                },
                {
                  type: Dialog,
                  ref: 'app-dialog'
                }
              ]
            }
          
          se não for o caso, defina a propriedade noExternalComponents para true`);
    }

    if (this.componentsRef && !Array.isArray(this.componentsRef)) {
      throw new Error(`componentsRef deve ser uma array de ComponentRef!!!`);
    }

    if (this.componentsRef?.length) {
      if (
        this.componentsRef.some((c) => !(c.type.prototype instanceof Component))
      ) {
        throw new Error(
          `ComponentRef deve sempre ter o parametro type do tipo Component!!! Cheque os componentes: ${this.componentsRef
            .filter((c) => !(c.type.prototype instanceof Component))
            .map((c) => c.type.name)
            .join(',')}`,
        );
      }

      if (checkDuplicatedValue(this.componentsRef, 'ref')) {
        throw new Error(`Voce não pode ter refências duplicadas!!! 
          olhe seu componente ${this.constructor.name} e verifique as referências que você está passando para o construtor!`);
      }
    }
  }

  stylesApplay(template, styles) {
    Object.keys(styles).forEach(
      function (cssClassName) {
        (template instanceof HTMLCollection ? Array.from(template) : [template])
          .map(function (element) {
            return element.parentElement.getElementsByClassName(cssClassName);
          })
          .forEach(function (elements) {
            Array.from(elements).forEach((element) => {
              element.classList.replace(cssClassName, styles[cssClassName]);
            });
          });
      }.bind(this),
    );
  }

  /**
   *
   * @param {Element} element
   * @param {Component} context
   * @param {object} IGNOREPROPS
   * @param {Element} __tamplate
   */
  setAttributes(element, context, IGNOREPROPS = {}, __tamplate) {
    const template = __tamplate || this.template;
    const props = Object.getOwnPropertyNames(context);
    const attributes = element.getAttributeNames();
    const functions = Object.getOwnPropertyNames(
      Object.getPrototypeOf(context),
    );

    attributes
      .filter((attr) => !Object.values(IGNOREPROPS).includes(attr))
      .forEach((attr) => {
        const value = element.getAttribute(attr);

        if (/^\{.+\}$/.test(value)) {
          const propertyName = props.filter(
            (fn) => fn === value.substring(1, value.length - 1),
          )[0];

          if (propertyName) {
            const property = context[propertyName];

            if (property instanceof Function) {
              template.setAttribute(attr, property.bind(context)());
            } else {
              template.setAttribute(attr, property);
            }
          } else {
            throw new Error(
              `propriedade não definida em ${context.constructor.name}`,
            );
          }
        } else {
          if (attr === 'class') {
            template.classList.add(value);
          } else if (attr.startsWith('on')) {
            const event = this.element.getAttribute(attr);
            const eventName = attr.substring(2);
            this.setEvent(event, eventName, props, functions, template);
          } else {
            template.setAttribute(attr, value);
          }
        }
      });
  }

  setEvent(event, eventName, props, functions, target) {
    if (event) {
      const functionContext = functions
        .filter((fn) => fn === event.substring(0, event.indexOf('(')))
        .map((fn) => this.context[fn].bind(this.context))[0];

      const propsContext = props
        .filter((fn) => fn === event.substring(0, event.indexOf('(')))
        .map((fn) => this.context[fn].bind(this.context))
        .filter((fn) => fn instanceof Function)[0];

      if (functionContext) {
        target.addEventListener(eventName, (e) => functionContext(e));
      } else if (propsContext) {
        target.addEventListener(eventName, (e) => propsContext(e));
      } else {
        target.addEventListener(eventName, () =>
          console.log('método não implementado'),
        );
      }
    }
  }

  render() {
    if (this.styles) {
      this.stylesApplay(this.template, this.styles);
    }
    return render(this);
  }
}
