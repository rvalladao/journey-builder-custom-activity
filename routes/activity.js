'use strict';

const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const util = require('util');
const axios = require('axios');

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
    res.send(200, 'Edit');
};

exports.save = function (req, res) {
    console.log('save request');
    // logData(req);
    res.send(200, 'Save');
};

exports.execute = function (req, res) {
    logData(req);
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        // console.log('buffer hex', req.body.toString('hex'));

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            var decodedArgs = decoded.inArguments[0];
            // console.log('inArguments', JSON.stringify(decoded.inArguments));
            // console.log('decodedArgs', JSON.stringify(decodedArgs));

            const payload = decodedArgs['payload'];
            const phoneNumber = decodedArgs['phoneNumber'];

            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Key ${process.env.BLIPAUTHORIZATIONKEY}`
            }


            const guid_id = uuidv4();

            const post_save = {
                "id": guid_id,
                "to": "postmaster@wa.gw.msging.net",
                "method": "get",
                "uri": `lime://wa.gw.msging.net/accounts/+${phoneNumber}`
            }

            axios.post('https://genialinvestimentos.http.msging.net/commands', post_save, { headers: headers }).then((res) => {
                const post_hsm = {
                    "id": guid_id,
                    "to": `${phoneNumber}@wa.gw.msging.net`,
                    "type": "application/json",
                    "content": {
                        "type": "template",
                        "template": {
                            "namespace": "3780c0dc_8aef_48e8_bbe1_af7f0af827db",
                            "element_name": templateName,
                            "language": {
                                "policy": "deterministic",
                                "code": "pt_BR"
                            }
                        }
                    }
                }


                axios.post('https://genialinvestimentos.http.msging.net/messages', post_hsm, { headers: headers }).then((res) => {
                    console.log(`Success send whatsapp to ${phoneNumber}`);
                }).catch((err) => {
                    console.error(`ERROR send whatsapp to ${phoneNumber}: ${err}`)
                })
            }).catch((err) => {
                console.error(`ERROR verify whatsapp to ${phoneNumber}: ${err}`)
            })

            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};

exports.publish = function (req, res) {
    console.log('publish request');
    logData(req);
    res.send(200, 'Publish');
};

exports.validate = function (req, res) {
    console.log('validate request');
    logData(req);
    res.send(200, 'Validate');
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}