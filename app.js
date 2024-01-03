'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var http = require('http');
var path = require('path');
var request = require('request');
var routes = require('./routes');
var activity = require('./routes/activity');
const JWT = require(path.join(__dirname, 'lib', 'jwtDecoder.js'));
var url = require('url');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({ type: 'application/jwt' }));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/logout', routes.logout);

app.post('/journeybuilder/save/', activity.save);
app.post('/journeybuilder/validate/', activity.validate);
app.post('/journeybuilder/publish/', activity.publish);
//app.post('/journeybuilder/execute/', activity.execute);
app.post('/journeybuilder/execute/', async (req, res) => {
  console.log('execute request');

  const decoded = JWT(req.body);


  try {
      var postURL = url.parse(decoded.url, true);
      const postData = decoded.data;
      const options = {
          hostname: postURL.host,
          path: postURL.pathname,
          method: decoded.methodType,
          headers: {
              "Content-Type": "application/json"
          }
          
      }
      for (var i=0; i<decoded.headers.length; i++){
          var headerKey = decoded.headers[i].key;
          var headerValue = decoded.headers[i].value;
          options.headers[headerKey] = headerValue;
      }
      async function handleSubmit() {
          const response = await axios({method: options.method, headers: options.headers, url: postURL, data: postData});
          return response.data;
      }

      const jsonOut = await handleSubmit();
      console.log(await jsonOut);
      res.status(200);
      res.json(await jsonOut);

  } catch (error) {
      console.log(error);
      return res.status(401).end();
  }


  
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});