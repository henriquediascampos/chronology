import Template from "./Button.html";
import "./Button.css";
import { createElement } from "../../utils/component-factory";
import {Icon} from "../icon/Icon";


const BUTTON_PROPS = Object.freeze({
    ONCLICK: 'onclick',
    START_ICON: 'startIcon',
    END_ICON: 'endIcon'
  })

/**
 * Cria um botão HTML.
 * @param {HTMLButtonElement} element - O icone.
 * @param {object} context - O icone.
 * @returns {HTMLButtonElement} - O botão HTML criado dinamicamente.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export function Button(element, context) {
  /** @type {HTMLButtonElement} btn */
  const template = createElement(Template);

  const attributes = element.getAttributeNames();
  const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(context));
  const props = Object.getOwnPropertyNames(context);

  validate(functions, props, context);

  setOnclick(element, functions, context, props, template);
  setOthersAttributes(attributes, element, props, context, template);

  if (element.hasAttribute(BUTTON_PROPS.START_ICON)) {
    const icon = Icon({value: element.getAttribute(BUTTON_PROPS.START_ICON)});
    template.append(icon);
  }
  template.append(...element.childNodes);

  return template;
}


function setOthersAttributes(attributes, element, props, context, template) {
  attributes
    .filter((attr) => !Object.values(BUTTON_PROPS).includes(attr))
    .forEach((attr) => {
      const value = element.getAttribute(attr);
      if (/^\{.+\}$/.test(value)) {
        const propertyName = props.filter(
          (fn) => fn === value.substring(1, value.length - 1)
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
            `propriedade não definida em ${context.constructor.name}`
          );
        }
      }
    });
}

function setOnclick(element, functions, context, props, template) {
  const onclick = element.getAttribute("onclick");
  if (onclick) {
    const functionContext = functions
      .filter((fn) => fn === onclick.substring(0, onclick.indexOf("(")))
      .map((fn) => context[fn].bind(context))[0];

    const propsContext = props
      .filter((fn) => fn === onclick.substring(0, onclick.indexOf("(")))
      .map((fn) => context[fn].bind(context))
      .filter((fn) => fn instanceof Function)[0];

    if (functionContext) {
      template.addEventListener("click", (e) => functionContext(e));
    } else if (propsContext) {
      template.addEventListener("click", (e) => propsContext(e));
    } else {
      template.addEventListener("click", () => console.log("método não implementado")
      );
    }
  }
}

function validate(functions, props, context) {
  if (functions.some((fn) => props.includes(fn))) {
    const duplicated = functions.filter((fn) => props.includes(fn));
    throw new Error(`Você não pode ter functione propriedades com mesmo nome em sua classe [${context.constructor.name}]. \n Considere renomear a(s) funçõe(s) ou atributo(s): ${duplicated.join(",")}`);
  }
}

