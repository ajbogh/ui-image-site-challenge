'use strict';

import { enableSPAHyperlink } from '../util/link-util.js';

export default (function() {
  class SearchBar extends HTMLElement {
    static get observedAttributes() {
      return ['enabled', 'label'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.setupEventListeners();
    }

    setupEventListeners() {
      this.addEventListener("toggle-search", () => {
        this.render(this);
      });
    }

    async connectedCallback() {
      this.render(this);
    }

    toggleSearch() {
      this.setAttribute('enabled', !this.enabled);
      this.dispatchEvent(new CustomEvent('toggle-search'));
    }

    debounceSearch(value) {
      if(this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('filter-results', 
            { 
              detail: {
                label: value 
              }
            }
          )
        );
      }, 500);
    }

    get enabled () {
      return this.getAttribute('enabled') === 'true';
    }

    get label () {
      return this.getAttribute('label');
    }

    render(el) {
      const div = document.createElement('div');
      div.classList.add('search-bar', 'form-check');

      const checkboxLabel = document.createElement('label');
      checkboxLabel.classList.add('form-check-label');
      const checkbox = document.createElement('input');
      checkbox.classList.add('form-check-input')
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('name', 'enable-search');
      if (el.enabled) {
        checkbox.setAttribute('checked', '');
      }
      checkbox.addEventListener('change', el.toggleSearch.bind(el));

      const enableSpan = document.createElement('span');
      enableSpan.innerText = ' Enable';

      checkboxLabel.appendChild(checkbox);
      checkboxLabel.appendChild(enableSpan);

      const filterTextDiv = document.createElement('div');
      filterTextDiv.innerText = 'Filter by Label: ';

      filterTextDiv.appendChild(checkboxLabel)

      div.appendChild(filterTextDiv);

      if(el.enabled) {
        const searchInputDiv = document.createElement('div');
        const searchInput = document.createElement('input');
        searchInput.classList.add('form-check-input')
        searchInput.setAttribute('name', 'search');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Enter a label');
        searchInput.value = el.label;
        searchInput.addEventListener('keyup', (event) => {
          // try prevents errors while rendering
          try {
            this.debounceSearch(event.target.value).bind(el);
          } catch (e){}
        }); 

        searchInputDiv.appendChild(searchInput);
        div.appendChild(searchInputDiv);
      }
      
      el.innerHTML = `
        <style>
          input[name="enable-search"] {
            vertical-align: sub;
          }
        </style>
      `;
      el.appendChild(div);
    }
  }

  // let the browser know about the custom element
  customElements.define('search-bar', SearchBar);
})();