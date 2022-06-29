'use strict';

export default (function() {
  class ImageFigure extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();
    }

    async connectedCallback() {
      this.render(this);
    }

    render(el) {
      const { Img_Name: imgName, Label: label, Top: top, Left: left, Height: height, Width: width } = this.imageData;
      const figure = document.createElement('figure');

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('image-wrapper');

      const imageLink = document.createElement('a');
      imageLink.classList.add('image-link');
      imageLink.href = `/image/${encodeURIComponent(imgName)}`;

      const boundingBox = document.createElement('div');
      boundingBox.classList.add('bounding-box');
      
      const image = document.createElement('img');
      image.src = `images/${encodeURIComponent(imgName)}`;
      image.setAttribute('width', '300');

      image.addEventListener('load', (event) => {
        const { clientWidth, clientHeight, naturalHeight, naturalWidth } =  event.target;

        boundingBox.style.display = 'block';
        boundingBox.style.top = `${(clientHeight * top) / naturalHeight}px`;
        boundingBox.style.left = `${(clientWidth * left) / naturalWidth}px`;
        boundingBox.style.width = `${(clientWidth * width) / naturalWidth}px`;
        boundingBox.style.height = `${(clientHeight * height) / naturalHeight}px`;
      });

      imageLink.appendChild(image);

      
      imageWrapper.appendChild(imageLink);
      imageWrapper.appendChild(boundingBox);

      const figCaption = document.createElement('figcaption');

      figCaption.innerHTML = `
        <div><a class="image-link" href="/image/${encodeURIComponent(imgName)}">${imgName}</a></div>
        <div>${label}</div>
      `;

      figure.appendChild(imageWrapper);
      figure.appendChild(figCaption);
      
      el.innerHTML = `
        <style>
          .image-wrapper {
            position: relative;
          }
          div.bounding-box {
            position: absolute;
            border: 2px solid red;
            display: none;
          }

          figure {
            box-shadow: 0px 0px 12px rgba(0, 0, 0, .08);
            border-radius: 3px;
            margin-bottom: 25px;
            background: #fff;
            padding: 10px;
          }
        </style>
      `;
      el.appendChild(figure);
    }

    // gathering data from element attributes
    get imageData() {
      let data = {};
      
      try {
        data = JSON.parse(this.children[0].innerHTML);
      } catch(e) {
        console.error(e);
      }

      return data;
    }
  }

  // let the browser know about the custom element
  customElements.define('image-figure', ImageFigure);
})();