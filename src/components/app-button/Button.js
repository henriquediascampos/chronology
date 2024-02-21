import Template from "./Button.html";
import "./Button.css";
import { createElement } from "../../core/component-factory";
import { Componet } from "../../core/Component";
import { Ripple } from "../ripple/Ripple";

const BUTTON_PROPS = Object.freeze({
  ONCLICK: "onclick",
  START_ICON: "startIcon",
  END_ICON: "endIcon",
  BG_COLOR: "bgColor",
});

/**
 * Cria um botão HTML.
 * @param {HTMLButtonElement} element - O icone.
 * @param {object} context - O icone.
 * @returns {HTMLButtonElement} - O botão HTML criado dinamicamente.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class Button extends Componet {
  /** @type {HTMLButtonElement} btn */

  constructor(element, context) {
    const template = createElement(Template);
    super(template, null, true);

    //atribuições
    this.attributes = element.getAttributeNames();
    this.functions = Object.getOwnPropertyNames(
      Object.getPrototypeOf(context)
    );
    this.props = Object.getOwnPropertyNames(context);
    this.context = context
    this.element = element


    //start da logica
    this.validate(context);
    this.setOnclick();
    this.setOthersAttributes();

    if (element.hasAttribute(BUTTON_PROPS.START_ICON)) {
      // const icon = Icon({
      //   value: element.getAttribute(BUTTON_PROPS.START_ICON),
      // });
      // this.template.append(icon);
    }
    this.template.append(...element.childNodes);

    this.handleButton()
  }

  setOthersAttributes() {
    this.attributes
      .filter((attr) => !Object.values(BUTTON_PROPS).includes(attr))
      .forEach((attr) => {
        const value = this.element.getAttribute(attr);

        if (/^\{.+\}$/.test(value)) {
          const propertyName = this.props.filter(
            (fn) => fn === value.substring(1, value.length - 1)
          )[0];

          if (propertyName) {
            const property = this.context[propertyName];
            if (property instanceof Function) {
              this.template.setAttribute(attr, property.bind(this.context)());
            } else {
              this.template.setAttribute(attr, property);
            }
          } else {
            throw new Error(
              `propriedade não definida em ${this.context.constructor.name}`
            );
          }
        } else {
          this.template.setAttribute(attr, value);
        }
      });
  }

  setOnclick() {
    const onclick = this.element.getAttribute("onclick");
    if (onclick) {
      const functionContext = this.functions
          .filter((fn) => fn === onclick.substring(0, onclick.indexOf("(")))
          .map((fn) => this.context[fn].bind(this.context))[0];

      const propsContext = this.props
          .filter((fn) => fn === onclick.substring(0, onclick.indexOf("(")))
          .map((fn) => this.context[fn].bind(this.context))
          .filter((fn) => fn instanceof Function)[0];

      if (functionContext) {
        this.template.addEventListener("click", (e) => functionContext(e));
      } else if (propsContext) {
        this.template.addEventListener("click", (e) => propsContext(e));
      } else {
        this.template.addEventListener("click", () =>
          console.log("método não implementado")
        );
      }
    }
  }

  validate(context) {
    if (this.functions.some((fn) => this.props.includes(fn))) {
      const duplicated = this.functions.filter((fn) => this.props.includes(fn));
      throw new Error(
        `Você não pode ter functione propriedades com mesmo nome em sua classe [${
          this.context.constructor.name
        }]. \n Considere renomear a(s) funçõe(s) ou atributo(s): ${duplicated.join(
          ","
        )}`
      );
    }
  }


  handleButton() {
    this.template.classList.add('ripple', 'starting-position-click');
    new Ripple(this.template)
    const color = this.template.getAttribute('color');
    const bgColor = this.template.getAttribute('bgcolor');
    this.template.style.setProperty('--color-fill', color || '#000');
    this.template.style.color = color;
    this.template.style.backgroundColor = bgColor;
}
}
