'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';
import { setPageTitle } from '../util/title.js';

export default (function() {
  class HomeView extends HTMLElement {
    static get observedAttributes() {
      return ['loading', 'label', 'page', 'count', 'total', 'search-enabled'];
    }

    constructor() {
      // establish prototype chain
      super();

      console.log('----home view');
      setPageTitle({ prepend: '' });

      this.count = 10;
      this.total = 0;
      this.page = 0;
      this.searchEnabled = true;

      this.setupEventListeners();
      this.fetchData();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("images-loaded", (event) => {
        const { images, total, page } = event.detail;

        this.images =  images;
        this.total = total;
        this.page = page;
        this.render(this);

        this.querySelectorAll('.image-link').forEach(imageLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(imageLink);
        });
      });
    }

    filterEventListener (data) {
      const { label } = data.detail;
      this.label = label;
      this.page = 0;

      this.fetchData();
    }

    toggleSearchEventListener () {
      this.searchEnabled = !this.searchEnabled;

      if(!this.searchEnabled) {
        this.label = '';
        this.page = 0;
        this.fetchData();
      }
    }

    pageListener (event) {
      this.setAttribute('page', event.detail.page);
      this.fetchData();
    }

    async fetchData() {
      this.setAttribute('loading', true);
      const response = await fetch(`/api/images?onlyExistingImages=true&label=${this.label}&page=${this.page}${this.count > 0 ? `&count=${this.count}` : ''}`);
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('images-loaded', { detail: json }));
      this.setAttribute('loading', false);
      return json;
    }

    async connectedCallback() {
      this.render(this);
    }

    get label() {
      return this.getAttribute('label') || '';
    }

    get searchEnabled() {
      return this.getAttribute('search-enabled') === 'true';
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

    set label (value) {
      this.setAttribute('label', value);
    }

    set page (value) {
      this.setAttribute('page', value);
    }

    set count (value) {
      this.setAttribute('count', value);
    }

    set total (value) {
      this.setAttribute('total', value);
    }

    set searchEnabled (value) {
      this.setAttribute('search-enabled', value);
    }

    render(el) {
      const titleElem = document.createElement('h1');
      titleElem.innerText = "Home";

      const ul = document.createElement('ul');
      ul.classList.add('images-list');

      (el.images || []).forEach(image => {
        const li = document.createElement('li');
        li.classList.add('image-list-item');
        li.innerHTML =  `
          <image-figure>
            <script type="text/json">
              ${JSON.stringify(image, null, 2)}
            </script>
          </image-figure>
        `;

        ul.appendChild(li);
      });

      const filterElem = document.createElement('search-bar');
      filterElem.setAttribute('enabled', el.searchEnabled);
      filterElem.setAttribute('label', el.label || '');
      filterElem.addEventListener('filter-results', el.filterEventListener.bind(el));
      filterElem.addEventListener('toggle-search', el.toggleSearchEventListener.bind(el));

      const pagerButtons = document.createElement('pager-buttons');
      pagerButtons.setAttribute('page', el.page);
      pagerButtons.setAttribute('count', el.count);
      pagerButtons.setAttribute('total', el.total);
      pagerButtons.addEventListener('page', el.pageListener.bind(el));

      el.innerHTML = `
        <style>
          ul.images-list {
            list-style-type: none;
            padding-left: 20px;
            padding-right: 20px;
            display: flex;
            flex-wrap: wrap;
          }
        </style>
      `;
      
      el.appendChild(titleElem);
      el.appendChild(filterElem);
      el.appendChild(ul);
      el.appendChild(pagerButtons);
    }
  }

  // let the browser know about the custom element
  customElements.define('home-view', HomeView);
})();