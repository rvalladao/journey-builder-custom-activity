'use strict';

const axios = require('axios');

exports.apiHandler = async (req, res) => {
    
    try{
        var json = req.body;

        const genuuid = uuidv4();

        var originalPostData = JSON.stringify(json.payload).replace(/(GUID\(\))/g, genuuid); //convert to JSON string
        console.log(originalPostData);
        var postData = JSON.parse(originalPostData);
        console.log(postData);

        var settings = {
            "url": json.url,
            "payload": postData,
            "method": json.method,
            "timeout": 7000,
            "headers": json.headers,
            "crossDomain": true					
        };


        async function getResponse() {
            const responseaxios = await axios({method: settings.method, headers: settings.headers, url: settings.url, data: settings.payload});
            return responseaxios;
            //console.log('testresponse:', responseaxios);
        }
        const jsonResponse = await getResponse();
        const jsonObject = {
            status: jsonResponse.status,
            statusText: jsonResponse.statusText,
            data: jsonResponse.data
        }
        return res.status(200).send(jsonObject);

    } catch (error) {
        if(error.code === 'ENOTFOUND') {
            const jsonObject = {
                status: 400,
                data: {message: error.message}
            }
            return res.status(200).send(jsonObject);
        } else if (error.code === 'ETIMEDOUT') {
            const jsonObject = {
                status: 400,
                data: {message: error.message}
            }
            return res.status(200).send(jsonObject);
        } else if (error.message === 'Request failed with status code 400') {
            const jsonObject = {
                status: 400,
                data: {message: error.message}
            }
            return res.status(200).send(jsonObject);
        }
        console.log('erro:',error.response.data);
        const jsonObject = {
            data: error.response.data
        }
        return res.status(200).send(jsonObject);
    }

        


}