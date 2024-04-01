/**
 *
 * @param {EventTarget} target
 * @param {string} eventName
 *
 * @returns {ReadableStream}
 */
const fromEvent = (target, eventName) => {
  let _listner;
  return new ReadableStream({
    start(controller) {
      _listner = (e) => controller.enqueue(e);
      target.addEventListener(eventName, _listner);
    },
    cancel() {
      target.removeEventListener(eventName, _listner);
    },
  });
};

export { fromEvent };
