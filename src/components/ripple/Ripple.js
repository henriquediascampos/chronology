import { BasicComponent } from '../../core/BasicComponent.js';
import styles from './Ripple.css';
import Tamplate from './Ripple.html';
export class Ripple extends BasicComponent {
  /** @type {string[]} */
  ids = [];

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
    targetRipple.classList.add(
      this.styles['ripple'],
      this.styles['starting-position-click'],
    );

    targetRipple.addEventListener('mousedown', (event) => {
      this.openRipple(event);
    });

    targetRipple.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        this.openRipple(event);
        this.autoRemove();
      }
    });

    targetRipple.addEventListener('mouseleave', (e) => {
      console.log(e.target);
      if (e.buttons > 0) {
        this.autoRemove();
      }
    });

    targetRipple.addEventListener('mouseup', () => {
      this.autoRemove();
    });
  }

  autoRemove() {
    const id = this.ids.shift();
    const rippleElement = document.querySelector(`#${id}`);
    if (rippleElement && id) {
      setTimeout(() => {
        rippleElement.classList.add(this.styles['ripple-element-off']);
      }, 150);
      setTimeout(() => {
        this.removeRippleElementExists(id);
      }, 896);
    }
  }

  /**
   *
   * @param {Event} event
   */
  openRipple(event) {
    const $target = event.currentTarget;
    const $ripple = this.createRippleElement(event, $target);
    $target.appendChild($ripple);

    setTimeout(() => {
      $ripple.classList.add(this.styles['ripple-element-on']);
    }, 50);
  }

  removeRippleElementExists(id) {
    const rippleExists = document.querySelector(`#${id}`);
    if (rippleExists && id) {
      rippleExists.remove();
    }
  }

  /**
   *
   * @param {MouseEvent | KeyboardEvent} event
   * @param {HTMLElement} currentTarget
   * @returns {HTMLDivElement}
   */
  createRippleElement(event, currentTarget) {
    /**@type {HTMLDivElement} */
    const tamplate = new Ripple().render();
    tamplate.id = this.generateUniqueId();
    this.ids.push(tamplate.id);

    const rect = currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const startingPositionRelativeToClick = currentTarget.classList.contains(
      this.styles['starting-position-click'],
    );
    const { offsetWidth } = currentTarget;
    let side = offsetWidth * 1.15;
    if (event instanceof MouseEvent) {
      const distanceToLeft = x;
      const distanceToRight = offsetWidth - x;
      const distanceToEdge = Math.max(distanceToLeft, distanceToRight);
      side = distanceToEdge * 2.2;
    }
    tamplate.style.setProperty('--ripple-side', `${side}px`);

    if (startingPositionRelativeToClick && event instanceof MouseEvent) {
      tamplate.style.top = `${y}px`;
      tamplate.style.left = `${x}px`;
    } else {
      tamplate.classList.add(styles.suspend);
    }
    return tamplate;
  }

  generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 10000);
    const uniqueId = `ripple-${timestamp}-${randomValue}`;

    return uniqueId;
  }
}
