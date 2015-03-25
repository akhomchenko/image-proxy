'use strict';

const express = require('express');
const compression = require('compression');
const request = require('request').defaults({encoding: null});

const IMAGE_CONTENT_TYPE_REGEXP = /image\/.*/;

const app = express();

app.use(compression());

app.use(express.static(`${__dirname}/public`));

app.get('/base64', function (req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({error: 'Image URL is not provided'});
  }
  request.get(url, function (error, response, body) {
    if (error) {
      return res.status(400).json({error: 'Failed to fetch image'});
    }
    const contentType = response.headers['content-type'];
    if (!IMAGE_CONTENT_TYPE_REGEXP.test(contentType)) {
      return res.status(400).json({error: 'Not an image'});
    }
    const data = `data:${contentType};base64,${new Buffer(body).toString('base64')}`;
    res.json({url: url, base64: data});
  });
});

const server = app.listen(process.env.PORT || 3000, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log(`Image proxy app listening at http://${host}:${port}`);
});
