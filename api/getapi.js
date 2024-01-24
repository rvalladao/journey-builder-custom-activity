'use strict';

const axios = require('axios');
import { sql } from "@vercel/postgres";

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
        
        var json = req.body;


        var settings = {
            "url": "https://"+process.env.subDomain+".rest.marketingcloudapis.com/data/v1/async/dataextensions/key:0E607D2A-88A7-4F3C-8180-2DE458756120/rows",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer "+token.data.access_token,
                "Content-Type": "application/json"
            },
            "crossDomain": true,
            "data": JSON.stringify(
                {
                    items: [{
                        journeyId: json.postData.journeyIDReal,
                        payload: json.postData.data,
                        journeyName: json.postData.journeyName,
                        subscriberKey: json.postData.subscriberKey,
                        journeyVersion: json.postData.journeyVersionNumber,
                        mid: json.postData.mid,
                        url: json.postData.url,
                        statusCode: json.status
                    }]
                }
            )
        };

        async function logDE() {
            const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, data: settings.data, withCredentials: false});
            return response;
        }

        const jsonResponse = await logDE();

        await sql`INSERT INTO requests (journeyid, payload, journeyname, subscriberkey, journeyversion, mid, url, statuscode) VALUES (${json.postData.journeyIDReal}, ${json.postData.data}, ${json.postData.journeyName}, ${json.postData.subscriberKey}, ${json.postData.journeyVersionNumber}, ${json.postData.mid}, ${json.postData.url}, ${json.status});`;

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
    const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, data: postData, withCredentials: false});
    return response;
}