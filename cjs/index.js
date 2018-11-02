/*! (c) Andrea Giammarchi - ISC */
const HTMLParsedElement = (() => {
  const DCL = 'DOMContentLoaded';
  const init = new WeakMap;
  const isParsed = el => {
    do {
      if (el.nextSibling)
        return true;
    } while (el = el.parentNode);
    return false;
  };
  class HTMLParsedElement extends HTMLElement {
    static withParsedCallback(Class, name = 'parsed') {
      const {prototype} = Class;
      const {connectedCallback} = prototype;
      const method = name + 'Callback';
      const cleanUp = (el, observer, ownerDocument, onDCL) => {
        observer.disconnect();
        ownerDocument.removeEventListener(DCL, onDCL);
        parsedCallback(el);
      };
      const parsedCallback = el => {
        init.set(el, true);
        el[method]();
      };
      Object.defineProperties(
        prototype,
        {
          connectedCallback: {
            configurable: true,
            value() {
              if (connectedCallback)
                connectedCallback.apply(this, arguments);
              if (method in this && !init.has(this)) {
                const self = this;
                const {ownerDocument} = self;
                init.set(self, false);
                if (ownerDocument.readyState === 'complete' || isParsed(self))
                  Promise.resolve(self).then(parsedCallback);
                else {
                  const onDCL = () => cleanUp(self, observer, ownerDocument, onDCL);
                  ownerDocument.addEventListener(DCL, onDCL);
                  const observer = new MutationObserver(() => {
                    /* istanbul ignore else */
                    if (isParsed(self))
                      cleanUp(self, observer, ownerDocument, onDCL);
                  });
                  observer.observe(self.parentNode, {childList: true, subtree: true});
                }
              }
            }
          },
          [name]: {
            configurable: true,
            get() {
              const value = init.has(this) ?
                (init.get(this) === true) :
                isParsed(this);
              if (value)
                Object.defineProperty(this, name, {value});
              return value;
            }
          }
        }
      );
      return Class;
    }
  }
  return HTMLParsedElement.withParsedCallback(HTMLParsedElement);
})();
module.exports = HTMLParsedElement;
