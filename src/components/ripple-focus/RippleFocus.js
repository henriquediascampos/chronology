import { BasicComponent } from '../../core/BasicComponent.js';
import styles from './RippleFocus.css';
import Tamplate from './RippleFocus.html';

export class RippleFocus extends BasicComponent {
  timeoutId;

  /**
   * @param {Prop} prop
   */
  constructor(prop) {
    const { source, context } = prop || {};
    super({
      templateString: Tamplate,
      styles,
      source,
      context,
      noExternalComponents: true,
    });

    if (context?.template) {
      this.addRippleEffect(context.template);
    }
  }

  /**
   *
   * @param {HTMLElement} targetRipple
   */
  addRippleEffect(targetRipple) {
    targetRipple.classList.add(this.styles['ripple-focus']);

    targetRipple.addEventListener('focus', () => {
      this.removeRippleElementExists(targetRipple);

      const $ripple = this.createRippleElement(targetRipple);
      targetRipple.appendChild($ripple);
    });

    targetRipple.addEventListener('focusout', () => {
      this.removeRippleElementExists(targetRipple);
    });
  }

  /**
   *
   * @param {HTMLElement} targetRipple
   */
  removeRippleElementExists(targetRipple) {
    const rippleExists = targetRipple.querySelector(
      `.${this.styles['ripple-focus-element']}`,
    );
    if (rippleExists) {
      rippleExists.remove();
    }
  }

  /**
   * @param {HTMLElement} targetRipple
   * @returns {HTMLDivElement}
   */
  createRippleElement(targetRipple) {
    const tamplate = new RippleFocus().render();
    const isIconButton = targetRipple.hasAttribute('icon-button');

    const width = isIconButton
      ? targetRipple.offsetWidth
      : targetRipple.offsetWidth * 0.82;

    tamplate.style.width = `${width}px`;
    tamplate.style.height = `${width}px`;

    return tamplate;
  }
}
