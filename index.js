var express = require('express');
var request = require('request').defaults({encoding: null});

var IMAGE_CONTENT_TYPE_REGEXP = /image\/.*/;

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/base64', function (req, res) {
  var url = req.query.url;
  if (!url) {
    res.status(400).json({error: 'Image URL is not provided'});
    return;
  }
  request.get(url, function (error, response, body) {
    if (error) {
      res.status(400).json({error: 'Failed to fetch image'});
      return;
    }
    var contentType = response.headers["content-type"];
    if (!IMAGE_CONTENT_TYPE_REGEXP.test(contentType)) {
      res.status(400).json({error: 'Not an image'});
      return;
    }
    var data = "data:" + contentType + ";base64," + new Buffer(body).toString('base64');
    res.json({origin: url, base64: data});
  });
});

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Image proxy app listening at http://%s:%s', host, port);
});
