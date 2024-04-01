import { checkDuplicatedValue } from '../utils/Array-utils';
import { BasicComponent } from './BasicComponent';

export class Component extends BasicComponent {
  /**
   * @type {string[]}
   */
  props;

  /**
   * @type {string[]}
   */
  functions;

  /**
   * @type {boolean} indicador de uso de componentes externos, usado para passar no validador que verifica a obrigatoriedade de informar componentesRef
   */
  noExternalComponents = false;

  /**
   * @param {ComponentProp} props propriedades para construção de Componet.
   */
  constructor(props) {
    const {
      templateString,
      styles,
      source,
      context,
      componentsRef,
      noExternalComponents,
    } = props;

    super({ templateString, styles, source, context, componentsRef });
    this.noExternalComponents = noExternalComponents;

    this.validateParametersConstructor(templateString);

    this.props = Object.getOwnPropertyNames(context);
    this.functions = Object.getOwnPropertyNames(Object.getPrototypeOf(context));
  }

  validateParametersConstructor(template) {
    if (!this.template) {
      throw new Error(
        'Você não definiu template para seu componente! Importe seu html e use a função createElement de `component-factory` e passe seu string-html para criar seu template.',
      );
    }

    if (!this.context) {
      throw new Error(
        `${this.constructor.name}:: Context é um parametro obrigatório em seu componente vc pode se vc estiver construindo um componente externo manualmente, vc deve passar
            constructor(source, context) {
              const templete = createElement(Template);
              super(templete, styles, source, context, null, true);
            }
        `,
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
            constructor(source, context) {
              const templete = createElement(Template);
              super(templete, styles, source, context
                [
                  {
                    type: Button,
                    ref: 'app-button'
                  },
                  {
                    type: Dialog,
                    ref: 'app-dialog'
                  }
                ]
              );
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

  /**
   * @typedef {object} Props
   * @property {string[]} specificPropsToIgnore
   * @property {string[]} specificPropsToAssign
   *
   * @param {Props} options
   * @param {Element} __tamplate
   */
  setAttributes({ specificPropsToAssign, specificPropsToIgnore }, __tamplate) {
    const template = __tamplate || this.template;

    let attributes = this.source?.getAttributeNames();

    if (specificPropsToIgnore) {
      attributes = attributes?.filter(
        (attr) => !specificPropsToIgnore?.includes(attr),
      );
    }

    if (specificPropsToAssign) {
      attributes = attributes?.filter((attr) =>
        specificPropsToAssign?.includes(attr),
      );
    }

    attributes?.forEach((attr) => {
      const value = this.source.getAttribute(attr);

      if (/^\{.+\}$/.test(value)) {
        const propertyName = this.props.filter(
          (fn) => fn === value.substring(1, value.length - 1),
        )[0];

        if (propertyName) {
          const property = this.context[propertyName];

          if (property instanceof Function) {
            template.setAttribute(attr, property.bind(this.context)());
          } else {
            template.setAttribute(attr, property);
          }
        } else {
          throw new Error(
            `propriedade não definida em ${this.context.constructor.name}`,
          );
        }
      } else {
        if (attr === 'class') {
          template.classList.add(value);
        } else if (attr.startsWith('on')) {
          const functionName = this.getFunctionName(attr);
          const eventName = attr.substring(2); // remove o prefixo on dos eventos declarado inline nas tags html
          this.setEvent(functionName, eventName, template);
        } else {
          template.setAttribute(attr, value);
        }
      }
    });
  }

  getFunctionName(attr) {
    let functionName = this.source.getAttribute(attr);
    const index = functionName.indexOf('(');

    functionName = functionName.substring(
      0,
      index < 1 ? functionName.length : index,
    );
    return functionName;
  }

  setEvent(functionName, eventName, target) {
    if (functionName) {
      const fn = this.extractPropContext(functionName);
      if (fn) {
        target.addEventListener(eventName, (e) => fn(e));
      } else {
        throw new Error(
          `a função ${functionName} não existe do componente ${this.constructor.name} originado em ${this.context.constructor.name}.`,
        );
      }
    }
  }

  extractPropContext(fnName) {
    const functionContext = this.functions
      .filter((fn) => fn === fnName)
      .map((fn) => this.context[fn].bind(this.context))[0];

    const propsContext = this.props
      .filter((fn) => fn === fnName)
      .map((fn) => this.context[fn].bind(this.context))
      .filter((fn) => fn instanceof Function)[0];

    return functionContext || propsContext;
  }
}
