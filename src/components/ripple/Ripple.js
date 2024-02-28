import styles from "./Ripple.css";

export class Ripple {
  timeoutId;

  constructor(element) {
    this.elementRipple = element;
    this.addRippleEffect();
  }

  addRippleEffect() {
    this.elementRipple.addEventListener("mousedown", (event) => {
      clearTimeout(this.timeoutId);
      this.removeRippleElementExists();
      const $target = event.currentTarget;
      const $ripple = this.createRippleElement(event, $target);

      $target.appendChild($ripple);
      setTimeout(() => {
        $ripple.classList.add(styles["ripple-element-on"]);
      }, 0);
    });

    this.elementRipple.addEventListener("mouseleave", (e) => {
      if (e.buttons > 0) {
        this.removeRippleElementExists();
      }
    });

    this.elementRipple.addEventListener("mouseup", () => {
      const rippleElement = document.querySelector(
        `.${styles["ripple-element"]}`
      );
      if (rippleElement) {
        rippleElement.classList.add(styles["ripple-element-off"]);
      }
      this.timeoutId = setTimeout(() => {
        this.removeRippleElementExists();
      }, 1500);
    });
  }

  removeRippleElementExists() {
    const rippleExists = document.querySelector(`.${styles["ripple-element"]}`);
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
    const $ripple = document.createElement("div");
    $ripple.classList.add(styles["ripple-element"]);
    const rect = currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const startingPositionRelativeToClick = currentTarget.classList.contains(
      styles["starting-position-click"]
    );
    if (startingPositionRelativeToClick) {
      $ripple.style.top = `${y}px`;
      $ripple.style.left = `${x}px`;
    }
    return $ripple;
  }
}
