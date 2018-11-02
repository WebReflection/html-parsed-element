# html-parsed-element

[![Build Status](https://travis-ci.com/WebReflection/html-parsed-element.svg?branch=master)](https://travis-ci.com/WebReflection/html-parsed-element) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/html-parsed-element/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/html-parsed-element?branch=master) ![WebReflection status](https://offline.report/status/webreflection.svg)

A base custom element class with a reliable `parsedCallback` method and a `parsed` getter.

It can be used as base class to extend or through its public static `withParsedCallback(Class, name = 'parsed'):Class` method;

Class born [after discussing why `connectedCallback` is considered harmful](https://github.com/w3c/webcomponents/issues/551#issuecomment-429262811) and how to properly setup any custom element.

Based off the [contributions](https://github.com/w3c/webcomponents/issues/551#issuecomment-431258689) by [@franktopel](https://github.com/franktopel) and [@irhadkul](https://github.com/irhadkul).

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

// or ...
const {withParsedCallback} = HTMLParsedElement;
customElements.define(
  'other-element',
  withParsedCallback(class extends HTMLElement {
    parsedCallback() {
      this.innerHTML = 'always <strong>safe</strong>!';
      console.log(this.parsed); // always true here
    }
  })
);
```

## How to install:

```js
// esm with a good bundler
import HTMLParsedElement from 'html-parsed-element';

// esm with a less good bundler
import HTMLParsedElement from 'html-parsed-element/esm';

// esm via CDN (or you can use a relative/absolute path)
import HTMLParsedElement from 'https://unpkg.com/html-parsed-element/esm/index.js';

// cjs
const HTMLParsedElement = require('html-parsed-element');

// bad cjs bundler
const HTMLParsedElement = require('html-parsed-element/cjs');
```

## Common gotcha

As of now, `html-parsed-element` is written and will be returned for `import` and `require()` in ES2015 (formerly known as "ES6"), so **make sure your build process properly transpiles `html-parsed-element` if you need to support less capable browsers.**
