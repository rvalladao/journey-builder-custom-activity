'use strict';

var activity = require('./activity');
var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var http = require('http');
var path = require('path');
var request = require('request');
// var routes = require('./');
var activity = require('./activity');
var getapi = require('./getapi');
var apiproxy = require('./apiproxy');
const { v4 } = require('uuid');

var app = express();

// exports.index = function (req, res) {
//     console.log('index request!');

//     if (!req.session.token) {
//         res.render('index', {
//             title: 'Unauthenticated',
//             errorMessage: 'This app may only be loaded via Salesforce Marketing Cloud',
//         });
//     } else {
//         res.render('index', {
//             title: 'Journey Builder Activity',
//             results: activity.logExecuteData,
//         });
//     }
// };

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({ type: 'application/jwt' }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// app.get('/', routes.index);

app.get('/api', (req, res) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});
  
app.get('/api/item/:slug', (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
});

app.post('/journeybuilder/save/', activity.save);
app.post('/journeybuilder/validate/', activity.validate);
app.post('/journeybuilder/publish/', activity.publish);
app.post('/journeybuilder/execute/', activity.execute);
app.post('/getjourneyid/', getapi.getjid);
app.post('/logtodataextension/', getapi.logToDataExtension);
app.post('/apihandler/', apiproxy.apiHandler);
app.get('/teste/', (req,res) => {
    res.end('hello, world');
})

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;