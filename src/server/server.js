const fs = require('fs');
const compression = require('compression');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Logger = require('./logger.js');
const Papa = require('papaparse');

const imageFileText = fs.readFileSync(path.resolve(__dirname, '../../mocks/train_labels.csv'), 'utf8');

const app = express();
const port = 3000;
let server;

// This will be filled in asynchronously by papaparse
let mockImages = [];

function send404(req, res) {
  // send your 404 here
  res.statusCode = 404;
  res.end('nothing here!');
}

// Start the express server
function startServer() {
  server = app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}`)
  });
  
  app.use((req, res, next) => {
    Logger.log(`Recieved ${req.method} ${req.url}`);
    next();
  });
  
  app.use('/', express.static(path.join(__dirname, '/../public')));
  
  app.get('/api/images', (req, res) => {
    const { page = 0, limit = 10, sortBy = 'Img_Name', order = 'ASC', label, onlyExistingImages = false } = req.query;
  
    let sortedImages = mockImages;

    if(label) {
      sortedImages = mockImages.filter(image => {
        return image.Label.toLowerCase().includes(label.toLowerCase());
      });
    }

    if(onlyExistingImages) {
      sortedImages = sortedImages.filter(image => fs.existsSync(path.resolve(__dirname, `../public/images/${image.Img_Name}`)));
    }
  
    const totalImages = sortedImages.length;
  
    sortedImages = sortedImages.sort((a, b) => {
      return a[sortBy].localeCompare(b[sortBy], undefined, {ignorePunctuation: true});
    });
  
    if(order === 'DESC') {
      sortedImages.reverse();
    }
  
    sortedImages = sortedImages.slice(page * limit, (page * limit) + limit);

    // need to check if the image file exists because the CSV references images that don't really exist
    if(!onlyExistingImages) {
      sortedImages = sortedImages.map(image => {
        const File_Exists = fs.existsSync(path.resolve(__dirname, `../public/images/${image.Img_Name}`));
        return {
          ...image,
          File_Exists // PascalCase follows CSV header format
        }
      });
    }
  
    res.json({
      images: sortedImages,
      page, 
      limit,
      order,
      sortBy,
      count: sortedImages.length,
      total: totalImages,
    });
  });
  
  app.get('/api/images/:imageName', (req, res) => {
    const imageData = mockImages.find(image => image.Img_Name === req.params.imageName);
    res.json(imageData);
    res.end(200);
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
  });
  
  app.use(send404); // catchall overrides need for 404
  app.use(compression());
}

// Read the mock CSV and store in server memory so it's always available and fast.
// We don't want to open it in each request.
// The complete 
Papa.parse(imageFileText, {
  header: true,
  dynamicTyping: true,
  worker: true,
  skipEmptyLines: true,
  complete: (results) => {
    Logger.log('CSV parsing complete.');
    mockImages = results.data;
    Logger.log(`Metadata for ${mockImages.length} images loaded into memory`);
    
    Logger.log('Starting server...');
    startServer();
  }
})

// Do graceful shutdown
function shutdown(type) {
  Logger.log(`${type} signal received: closing HTTP server`);
  server.close(() => {
    Logger.log('HTTP server closed')
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('exit', () => shutdown('exit'));