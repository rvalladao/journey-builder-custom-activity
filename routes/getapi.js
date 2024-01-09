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

        const token = await getAuthToken(req.body.mid);
        console.log('token',token.data);
        var json = req.body;


        var settings = {
            "url": "https://"+process.env.subDomain+"data/v1/async/dataextensions/key:0E607D2A-88A7-4F3C-8180-2DE458756120/rows",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer "+token.data.access_token,
                "Content-Type": "application/json"
            },
            "crossDomain": true,
            "data": JSON.stringify({items: [{data: json.postData}]})
        };

        console.log('settings:',settings);

        async function logDE() {
            const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, data: settings.data, withCredentials: false});
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
//
async function getAuthToken(mid) {
    var settings = {
        "url": "https://"+process.env.subDomain+".auth.marketingcloudapis.com/v2/token",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    }
    console.log('settingsauth:',settings);
    var postData = {
        "grant_type": "client_credentials",
        "client_id": process.env.clientId,
        "client_secret": process.env.clientSecret,
        "account_id": mid
    }
    console.log('postdataauth:',postData);
    const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, data: postData, withCredentials: false});
    return response;
}