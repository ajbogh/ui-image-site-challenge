Frontend UI/UX challenge
------------------------------

- Challenge:

  Build a user interface for displaying and searching an image dataset for training
  a neural net model for self-driving cars.

  We are providing you with the image dataset. The images are in the "images" folder
  and the labels are in the "labels.csv" file.

- Required features:

  - Display images
  - Draw bounding box on each image
  - Filter by label tag, disabled by default
  - Display label information

- Deliverables:

  An archive including the source code required to run the application.
  External dependencies should NOT be included, but should be obtainable with a single command (yarn, npm install, etc.).
  After obtaining dependencies, the user should be able to run and view the interface with a single, clearly documented command.

  Your archive should be named as <your initials>-frontend-challenge.<file type>, for example:
  abc-frontend-challenge.zip

- Notes:

  The app should take no more than three hours to complete, and should minimize the number of external runtime dependencies. If you manage to deliver all required features in a reasonable period, stand out of the crowd with features or UX polish of your choosing.

![Image Browser](/Screenshot_20220628_231035.png?raw=true "Image Browser")

# About the app

This app was developed using custom code by Allan Bogh. It uses [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) instead of SPA libraries such as React, Vue, or Angular, just to be a little more challenging. It uses Universal Router to create a SPA-like experience. There is no build step because everything runs in the browser, just edit some client-side code in `src/public` and refresh the page.

**Why not React?** - It was more challenging and fun to use web components. They are a standardized technology in the HTML spec that has great potential. React 

**Why Bootstrap?** - Bootstrap was only used to save time with developing CSS and making the site look nice.

**Any future opportunities** - The images aren't optimized. I would have liked to use a smart cropper that could compress and crop images to smaller sizes, but then I would have lost the original image sizes without adding server-side code. This would have limited my ability to render the bounding boxes on the thumbnails.

I would have liked to add HTTP2 but it would require self-signed certificates and additional time.

The code is missing history updates when the paging buttons are pressed. Perhaps a future update could add them.

# Running app:

Follow instructions in the [SETUP.md](SETUP.md) file

```
npm install 
npm install -g pm2

# in production
pm2 start ecosystem.config.js

# in development
npm run app
```
