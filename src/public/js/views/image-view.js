'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';
import { setPageTitle } from '../util/title.js';

export default (function() {
  class ImageView extends HTMLElement {
    static get observedAttributes() {
      return ['loading'];
    }

    constructor() {
      // establish prototype chain
      super();

      console.log('----image view');
      setPageTitle({ prepend: this.imageName });

      this.setupEventListeners();
      this.fetchData();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("image-loaded", (event) => {
        console.log('---image-loaded', event);
        this.imageData =  event.detail;
        this.render(this);
      });
    }

    async fetchData() {
      this.setAttribute('loading', true);
      const response = await fetch(`/api/images/${encodeURIComponent(this.imageName)}`);
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('image-loaded', { detail: json }));
      this.setAttribute('loading', false);
      return json;
    }

    async connectedCallback() {
      this.render(this);
    }

    get imageName() {
      return this.getAttribute('image-name') || undefined;
    }

    render(el) {
      const { imageData } = el;
      const { Img_Name: imageName, Height: height, Width: width, Label: label, Left: left, Top: top } = imageData || {};
      const titleElem = document.createElement('h1');
      titleElem.innerText = this.imageName;

      const article = document.createElement('article');

      article.innerHTML =  `
        <div class="image">
          <img src="images/${encodeURIComponent(this.imageName)}" />
          <div class="bounding-box" />
        </div>
        <div>
          <label>Label:</label> ${label}
        </div>
        <div>
          <label>Left:</label> ${left}
        </div>
        <div>
          <label>Top:</label> ${top}
        </div>
        <div>
          <label>Width:</label> ${width}
        </div>
        <div>
          <label>Height:</label> ${height}
        </div>
      `;

      el.innerHTML = `
        <style>
          div.image {
            position: relative;
          }
          div.bounding-box {
            position: absolute;
            border: 4px solid red;
            top: ${top}px;
            left: ${left}px;
            width: ${width}px;
            height: ${height}px;
          }
          h1.image-name {
            margin-top: 12px;
            margin-bottom: 2px;
          }
        </style>
      `;
      el.appendChild(titleElem);
      el.appendChild(article);
    }
  }

  // let the browser know about the custom element
  customElements.define('image-view', ImageView);
})();