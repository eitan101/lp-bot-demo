'use strict';

const MyCoolAgent = require('./MyCoolAgent');
const jsonReq = require('request').defaults({
    'json': true
});

const echoAgent = new MyCoolAgent({
    accountId: process.env.LP_ACCOUNT,
    username: process.env.LP_USER,
    appKey: process.env.LP_APP_KEY,
    secret: process.env.LP_APP_SECRET,
    accessToken: process.env.LP_APP_AT,
    accessTokenSecret: process.env.LP_APP_AT_SECRET,
    csdsDomain: process.env.LP_CSDS
});

echoAgent.on('MyCoolAgent.ContentEvnet', (contentEvent) => {
    var country = contentEvent.message;
    jsonReq.get({ url: `https://restcountries.eu/rest/v2/name/${country}?fields=capital` }, (e, r, body) => {
        if (body && body[0] && body[0].capital) {
            echoAgent.publishEvent({
                dialogId: contentEvent.dialogId,
                event: {
                    type: 'ContentEvent',
                    contentType: 'text/plain',
                    message: `The capital is ${body[0].capital}`
                }
            });
        }
    });
});