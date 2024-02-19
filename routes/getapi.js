'use strict';

const axios = require('axios');
//const createClient = require('@supabase/supabase-js');
import { createClient } from '@supabase/supabase-js';

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

exports.logToDB = async (req, res) => {
    
    try {

        var json = req.body;
        var fields = {
            journeyId: json.postData.journeyIDReal,
            payload: json.postData.data,
            journeyName: json.postData.journeyName,
            subscriberKey: json.postData.subscriberKey,
            journeyVersion: json.postData.journeyVersionNumber,
            mid: json.postData.mid,
            url: json.postData.url,
            statusCode: json.status
        };

        const supabase = createClient('https://xupcvntfxnhihogcgfmk.supabase.co', process.env.SUPABASE_KEY);

        const { data } = await supabase
            .from('apiusage')
            .insert({ 
                journeyId: fields.journeyId,
                journeyName: fields.journeyName,
                journeyVersion: fields.journeyVersion,
                subscriberKey: fields.subscriberKey,
                mid: fields.mid,
                statusCode: fields.statusCode
            })
            .select()

        console.log(data);

        res.status(200).send('Logged');
    } catch (error) {
        console.log(error);
        return res.status(401).end();
    }


}