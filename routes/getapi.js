'use strict';

const axios = require('axios');

exports.getjid = async (req, res) => {
    console.log(JSON.stringify(req.body));

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
        return response;
    }

    console.log(JSON.stringify(await getjourneyid()));
    res.status(200).send(await getjourneyid);

}