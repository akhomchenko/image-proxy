var express = require('express');
var request = require('request').defaults({encoding: null});

var IMAGE_CONTENT_TYPE_REGEXP = /image\/.*/;

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/base64', function (req, res) {
  var url = req.query.url;
  if (!url) {
    return res.status(400).json({error: 'Image URL is not provided'});
  }
  request.get(url, function (error, response, body) {
    if (error) {
      return res.status(400).json({error: 'Failed to fetch image'});
    }
    var contentType = response.headers["content-type"];
    if (!IMAGE_CONTENT_TYPE_REGEXP.test(contentType)) {
      return res.status(400).json({error: 'Not an image'});
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
