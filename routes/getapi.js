'use strict';

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');


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
        const dbid = uuidv4();

        console.log('fields: ',fields);
        console.log('uuid: ',dbid);
        console.log('key: ',process.env.SUPABASE_KEY);


        const supabase = createClient('https://xupcvntfxnhihogcgfmk.supabase.co', process.env.SUPABASE_KEY);

        async function insertData() {
            const { data, error } = await supabase
                .from('apiusage')
                .insert({ 
                    id: dbid,
                    journeyId: fields.journeyId,
                    journeyName: fields.journeyName,
                    journeyVersion: fields.journeyVersion,
                    subscriberKey: fields.subscriberKey,
                    mid: fields.mid,
                    statusCode: fields.statusCode
                })
                .select('*');
            
            if (error) {
                console.log('error: ', error);
                return;
            }

            console.log('data: ',data);
        }

        await insertData()

        res.status(200).send('Logged');
    } catch (error) {
        console.log(error);
        return res.status(401).end();
    }


}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}