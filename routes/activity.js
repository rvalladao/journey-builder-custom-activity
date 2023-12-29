'use strict';

const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const util = require('util');
const https = require('https');
const axios = require('axios');
var url = require('url');

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
    //console.log('save request');
    // logData(req);
    res.status(200).send('Save');
};

/*exports.execute = function(req, res) {
    console.log('execute request');

    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).end();
        }


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
            handleSubmit().then(items => {
                console.log(items);
                res.send(200,items);
            })
    });
};*/

exports.execute = async (req, res) => {
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
        //console.log('req: ', decoded);
        console.log('resp: ', await handleSubmit());
        res.status(200).json({"outArguments": [ await handleSubmit() ]});
    } catch (error) {
        console.log(error);
        return res.status(401).end();
    }


    /*JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).end();
        }


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
            handleSubmit().then(items => {
                console.log(items);
                res.send(200,items);
            })
    });*/
};

exports.publish = function (req, res) {
    //console.log('publish request');
    //logData(req);
    res.status(200).send('Publish');
};

exports.validate = function (req, res) {
    //console.log('validate request');
    //logData(req);
    res.status(200).send('Validate');
};