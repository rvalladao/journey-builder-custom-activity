'use strict';

const axios = require('axios');

exports.getjid = async (req, res) => {
    
    try {

        //console.log(JSON.stringify(req.body));

        var json = req.body;

        var settings = {
            "url": json.url+"interaction/v1/interactions?name="+json.journeyName,
            "method": "GET",
            "timeout": 0,
            "headers": {
            "Authorization": "Bearer "+json.token
            },
            "crossDomain": true					
        };

        async function getjourneyid() {
            const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, withCredentials: false});
            return response.data.items[0];
        }

        const jsonResponse = await getjourneyid();
        const jsonObject = {
            journeyid: jsonResponse.id
        };

        //console.log(await getjourneyid());
        res.status(200).send(jsonObject);
    } catch (error) {
        console.log(error);
        return res.status(401).end();
    }


}

exports.logToDataExtension = async (req, res) => {
    
    try {

        console.log(req.body);

        var json = req.body;


        var settings = {
            "url": json.url+"data/v1/async/dataextensions/key:0E607D2A-88A7-4F3C-8180-2DE458756120/rows",
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Authorization": "Bearer "+json.token
            },
            "crossDomain": true,
            "data": {items: [{data: json.postData}]}
        };

        console.log('settings:',settings);

        async function logDE() {
            const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, data: settings.postData, withCredentials: false});
            return response;
        }

        const jsonResponse = await logDE();

        //console.log(await getjourneyid());
        res.status(200).send('Logged');
    } catch (error) {
        console.log(error);
        return res.status(401).end();
    }


}