'use strict';

const axios = require('axios');

exports.apiHandler = async (req, res) => {
    
    try {

        console.log('body:',JSON.stringify(req.body));

        var json = req.body;

        var settings = {
            "url": json.url,
            "payload": json.payload,
            "method": json.method,
            "timeout": 7000,
            "headers": json.headers,
            "crossDomain": true					
        };

        async function getjourneyid() {
            const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, data:settings.payload, withCredentials: false});
            return response.data;
        }

        const jsonResponse = await getjourneyid();
        const jsonObject = {
            journeyid: jsonResponse
        };

        //console.log(await getjourneyid());
        res.status(200).send(jsonObject);
    } catch (error) {
        console.log(error);
        return res.status(401).end();
    }


}