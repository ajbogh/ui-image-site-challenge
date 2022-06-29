'use strict';

export default (function() {
  class PageTitle extends HTMLElement {
    static get observedAttributes() {
      return ['title', 'prepend', 'append', 'separator'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.style.display = 'none';

      this.writeTitle()
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.writeTitle();
    }

    writeTitle() {
      // get attribute values from getters
      let title = this.title;
      const prepend = this.prepend;
      const append = this.append;

      if(prepend) {
        title = `${prepend} ${this.separator} ${title}`;
      }

      if(append) {
        title += ` ${this.separator} ${append}`;
      }

      console.log('----title: ', title);

      document.title = title;
    }

    // gathering data from element attributes
    get title() {
      return this.getAttribute('title') || '';
    }

    get prepend() {
      return this.getAttribute('prepend') || '';
    }

    get append() {
      return this.getAttribute('append') || '';
    }

    get separator() {
      return this.getAttribute('separator') || '-';
    }
  }

  // let the browser know about the custom element
  customElements.define('page-title', PageTitle);
})();