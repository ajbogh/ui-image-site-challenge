'use strict';

export default (function() {
  class PagerButtons extends HTMLElement {
    static get observedAttributes() {
      return ['page', 'count', 'total'];
    }

    constructor() {
      // establish prototype chain
      super();
    }

    async connectedCallback() {
      this.render(this);
    }

    previousClickEventListener () {
      this.dispatchEvent(
        new CustomEvent('page', 
          { 
            detail: {
              page: this.page - 1,
            }
          }
        )
      );
    }

    nextClickEventListener () {
      this.dispatchEvent(
        new CustomEvent('page', 
          { 
            detail: {
              page: this.page + 1,
            }
          }
        )
      );
    }

    get page () { 
      return parseInt(this.getAttribute('page') || 0, 10);
    }

    get count () { 
      return parseInt(this.getAttribute('count') || 0, 10);
    }

    get total () { 
      return parseInt(this.getAttribute('total') || 0, 10);
    }

    render(el) {
      const nav = document.createElement('nav');
      nav.innerHTML = `
        Showing images ${el.page * el.count} to ${(el.page + 1) * el.count} of ${el.total} total images
      `;

      const ul = document.createElement('ul');
      ul.classList.add('pager');

      const previousLi = document.createElement('li');
      const previousButton = document.createElement('button');
      previousButton.innerText = "Previous";
      previousButton.disabled = el.page === 0;
      previousButton.addEventListener('click', el.previousClickEventListener.bind(el));
      previousLi.appendChild(previousButton);
      

      const nextLi = document.createElement('li');
      const nextButton = document.createElement('button');
      nextButton.disabled = el.page * el.count >= el.total - el.count;
      nextButton.innerText = "Next";
      nextButton.addEventListener('click', el.nextClickEventListener.bind(el));
      nextLi.appendChild(nextButton);

      ul.appendChild(previousLi);
      ul.appendChild(nextLi);

      nav.appendChild(ul);

      el.innerHTML = `
        <style>
        </style>
      `;
      el.appendChild(nav);
    }
  }

  // let the browser know about the custom element
  customElements.define('pager-buttons', PagerButtons);
})();
