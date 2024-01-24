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

app.post('/api/journeybuilder/save/', activity.save);
app.post('/api/journeybuilder/validate/', activity.validate);
app.post('/api/journeybuilder/publish/', activity.publish);
app.post('/api/journeybuilder/execute/', activity.execute);
app.post('/api/getjourneyid/', getapi.getjid);
app.post('/api/logtodataextension/', getapi.logToDataExtension);
app.post('/api/apihandler/', apiproxy.apiHandler);

// http.createServer(app).listen(app.get('port'), function () {
//   console.log('Express server listening on port ' + app.get('port'));
// });

module.exports = app;