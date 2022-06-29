'use strict';

import { enableSPAHyperlink } from '../util/link-util.js';

export default (function() {
  class Navbar extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // shadowroot has css style isolation, so we won't use it here because
      // we want to inherit styles from the stylesheet.

      // get attribute values from getters
      let items = this.items;

      const ul = document.createElement('ul');

      // This breaks best practices: Do not self-apply classes. 
      // https://developers.google.com/web/fundamentals/web-components/best-practices
      ul.classList.add('nav', 'navbar-nav');
      
      const hyperlinks = [];
      
      // set up onClick handlers for client-side navigation
      items.forEach((item) => {
        const liElem = document.createElement('li');
        const linkElem = document.createElement('a');
        linkElem.setAttribute('href', item.href);
        linkElem.innerText = item.text;
        enableSPAHyperlink(linkElem);

        liElem.appendChild(linkElem);
        ul.appendChild(liElem);
      });
      
      this.innerHTML = '';
      this.appendChild(ul);
    }

    // gathering data from element attributes
    get items() {
      let data = [];
      
      try {
        data = JSON.parse(this.children[0].innerHTML);
      } catch(ex) {
        console.error(ex);
      }

      return data;
    }
  }

  // let the browser know about the custom element
  customElements.define('nav-bar', Navbar);
})();