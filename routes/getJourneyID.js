const axios = require('axios');

exports.getJourneyID = async (req, res) => {

    var settings = {
        "url": req.url+"interaction/v1/interactions?name="+req.journeyName,
        "method": "GET",
        "timeout": 0,
        "headers": {
        "Authorization": "Bearer "+req.token
        },
        "crossDomain": true					
    };

    async function getjid() {
        const response = await axios({method: settings.method, headers: settings.headers, url: settings.url, withCredentials: false});
        return response;
    }

    console.log(JSON.stringify(getjid()));
    res.status(200).send(await getjid);

}