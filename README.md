# html-parsed-element

[![Build Status](https://travis-ci.com/WebReflection/html-parsed-element.svg?branch=master)](https://travis-ci.com/WebReflection/html-parsed-element) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/html-parsed-element/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/html-parsed-element?branch=master)

A base custom element class with a reliable `parsedCallback` method and a `parsed` getter.

Class born [after discussing why `connectedCallback` is considered harmful](https://github.com/w3c/webcomponents/issues/551#issuecomment-429262811) and how to properly setup any custom element.

```js
customElements.define(
  'custom-element',
  class extends HTMLParsedElement {
    parsedCallback() {
      this.innerHTML = 'always <strong>safe</strong>!';
      console.log(this.parsed); // always true here
    }
  }
);
```
