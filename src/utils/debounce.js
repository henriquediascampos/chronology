export class Debounce {
  #timeoutRef = null;

  constructor() {}

  /**
   *
   * @param {Function} fn
   * @param {number} delay
   * @returns
   */
  handle(fn, delay) {
    const debounce = (...args) => {
      window.clearTimeout(this.#timeoutRef);

      this.#timeoutRef = window.setTimeout(() => {
        fn(...args);
      }, delay);
    };

    return debounce;
  }
}
