'use strict';

const axios = require('axios');

exports.getjid = async (req, res) => {
    console.log(JSON.stringify(req));

    var settings = {
        "url": req.url+"interaction/v1/interactions?name="+req.journeyName,
        "method": "GET",
        "timeout": 0,
        "headers": {
        "Authorization": "Bearer "+req.token
        },
        "crossDomain": true					
    };

    async function getjourneyid() {
        const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, withCredentials: false});
        return response;
    }

    console.log(JSON.stringify(await getjourneyid()));
    res.status(200).send(await getjourneyid);

}