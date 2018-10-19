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
  const cleanUp = (el, observer, ownerDocument, onDCL) => {
    init.set(el, true);
    observer.disconnect();
    ownerDocument.removeEventListener(DCL, onDCL);
    parsedCallback(el);
  };
  const parsedCallback = el => el.parsedCallback();
  return class HTMLParsedElement extends HTMLElement {
    connectedCallback() {
      if ('parsedCallback' in this && !init.has(this)) {
        const self = this;
        const {ownerDocument} = self;
        init.set(self, false);
        if (ownerDocument.readyState === 'complete' || isParsed(self))
          Promise.resolve(self).then(parsedCallback);
        else {
          const onDCL = () => cleanUp(self, observer, ownerDocument, onDCL);
          ownerDocument.addEventListener(DCL, onDCL);
          const observer = new MutationObserver(() => {
            if (isParsed(self)) {
              cleanUp(self, observer, ownerDocument, onDCL);
              return true;
            }
          });
          observer.observe(self.parentNode, {childList: true, subtree: true});
        }
      }
    }
    get parsed() {
      return init.has(this) ? (init.get(this) === true) : isParsed(this);
    }
  };
})();
module.exports = HTMLParsedElement;
