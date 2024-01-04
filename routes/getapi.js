'use strict';

const axios = require('axios');

exports.getjid = async (req, res) => {
    
    try {

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