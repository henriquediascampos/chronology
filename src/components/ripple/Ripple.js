import styles from "./Ripple.css";
import Tamplate from "./Ripple.html";
import { Componet } from "../../core/Component.js";
import { createElement } from "../../core/component-factory.js";
export class Ripple extends Componet {
  timeoutId;

  /**
   * @param {HTMLButtonElement} _ - O icone.
   * @param {object} context - O icone.
   */
  constructor(_, context) {
    const tamplate = createElement(Tamplate);
    super(tamplate, styles, null, true);

    if (context?.template) {
      this.addRippleEffect(context.template);
    }
  }

  addRippleEffect(elementRipple) {
    elementRipple.classList.add(
      this.styles["ripple"],
      this.styles["starting-position-click"]
    );
    elementRipple.addEventListener("mousedown", (event) => {
      clearTimeout(this.timeoutId);
      this.removeRippleElementExists();
      const $target = event.currentTarget;
      const $ripple = this.createRippleElement(event, $target);

      $target.appendChild($ripple);
      setTimeout(() => {
        $ripple.classList.add(this.styles["ripple-element-on"]);
      }, 0);
    });

    elementRipple.addEventListener("mouseleave", (e) => {
      if (e.buttons > 0) {
        this.removeRippleElementExists();
      }
    });

    elementRipple.addEventListener("mouseup", () => {
      const rippleElement = document.querySelector(
        `.${styles["ripple-element"]}`
      );
      if (rippleElement) {
        rippleElement.classList.add(this.styles["ripple-element-off"]);
      }
      
      this.timeoutId = setTimeout(() => {
        this.removeRippleElementExists();
      }, 1500);
    });
  }

  removeRippleElementExists() {
    const rippleExists = document.querySelector(
      `.${this.styles["ripple-element"]}`
    );
    if (rippleExists) {
      rippleExists.remove();
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {HTMLElement} currentTarget
   * @returns {HTMLDivElement}
   */
  createRippleElement(event, currentTarget) {
    const tamplate = new Ripple().render();
    const rect = currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const startingPositionRelativeToClick = currentTarget.classList.contains(
      this.styles["starting-position-click"]
    );

    if (startingPositionRelativeToClick) {
      tamplate.style.top = `${y}px`;
      tamplate.style.left = `${x}px`;
    }
    return tamplate;
  }
}
