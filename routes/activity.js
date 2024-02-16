'use strict';

const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const util = require('util');
const axios = require('axios');
var url = require('url');
var jp = require('jsonpath');
const https = require('https');


exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + util.inspect(req.headers));
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

exports.edit = function (req, res) {
    console.log('edit request');
    // logData(req);
    res.status(200).send('Edit');
};

exports.save = function (req, res) {
    console.log('save request');
    // logData(req);
    res.send(200, 'Save');
};


exports.execute = async function (req, res) {
    logData(req);
    const decoded = JWT(req.body);
    console.log(JSON.stringify(decoded));

    const guid_id = uuidv4();
    var originalPostData = JSON.stringify(decoded.data);
    var replacedPostData = originalPostData.replace(/GUID\(\)/gi, guid_id);
    var postData = JSON.parse(replacedPostData);

    try {
        var postURL = url.parse(decoded.url, true);

        const mediaType = decoded.mediaType;
        const options = {
            hostname: postURL.host,
            path: postURL.pathname,
            method: decoded.methodType,
            headers: {
                "Content-Type": mediaType
            },
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

        const jsonResponse = await handleSubmit();

        console.log('response: ',jsonResponse);

        var jsonObject = {
            
        }

        for (var i=0; i<decoded.outArgumentCode.length; i++){
            var outArgumentKey = decoded.outArgumentCode[i].key;
            var outArgumentValue = decoded.outArgumentCode[i].value;
            var value = jp.value(jsonResponse, '$.'+outArgumentValue);
            jsonObject[outArgumentKey] = value;
        }


            // try
			// {

                

            //     var payloadPost = JSON.stringify({
            //         "postData": decoded,
            //         "status": 200,
            //         "mid": decoded.mid
            //     });
            //     console.log('payload: ', payloadPost);
			// 	var settings = {
            //         "hostname": "sfmc-custom-activity-math-ef70b3a192ad.herokuapp.com",
            //         "path": "/logtodataextension/",
            //         "method": "POST",
			// 		"headers": {
            //             "Content-Type": "application/json"
            //         }
			// 	  };

            //       var req = https.request(settings, (res) => {

            //         res.on('data', (d) => {
            //             process.stdout.write(d);
            //         });
            //       });
            //       req.on('error',(e) => {
            //         console.error(e);
            //       });
            //       req.write(payloadPost);
            //       req.end();
			// }
			// catch(err){
			// 	console.log('error:', err);

			// }
        if(jsonObject.length > 0) {
            res.status(200).send(jsonObject);
        } else {
            res.status(200).send('Execute');
        }

    } catch (error) {
        console.log(error);
        // try
		// 	{

        //         var payloadPost = JSON.stringify({
        //             "postData": decoded,
        //             "status": 401,
        //             "mid": decoded.mid
        //         });
		// 		var settings = {
        //             "hostname": "sfmc-custom-activity-math-ef70b3a192ad.herokuapp.com",
        //             "path": "/logtodataextension/",
        //             "method": "POST",
		// 			"headers": {
        //                 "Content-Type": "application/json"
        //             }
		// 		  };

        //           var req = https.request(settings, (res) => {
        //             res.on('data', (d) => {
        //                 process.stdout.write(d);
        //             });
        //           });
        //           req.on('error',(e) => {
        //             console.error(e);
        //           });
        //           req.write(payloadPost);
        //           req.end();
		// 	}
		// 	catch(err){
		// 		console.log('error:', err);
		// 	}
        return res.status(400).end();
    }


    
};

exports.publish = function (req, res) {
    console.log('publish request');
    //logData(req);
    res.status(200).send('Publish');
};

exports.validate = function (req, res) {
    console.log('validate request');
    //logData(req);
    res.status(200).send('Validate');
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}