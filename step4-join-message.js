'use strict';

const MyCoolAgent = require('./MyCoolAgent');
const fs = require('fs');
const echoAgent = new MyCoolAgent({
    accountId: process.env.LP_ACCOUNT,
    username: process.env.LP_USER,
    appKey: process.env.LP_APP_KEY,
    secret: process.env.LP_APP_SECRET,
    accessToken: process.env.LP_APP_AT,
    accessTokenSecret: process.env.LP_APP_AT_SECRET,
    csdsDomain: process.env.LP_CSDS
});


var mycard = JSON.parse(fs.readFileSync('./content/card1.json', 'utf8'));

echoAgent.on('MyCoolAgent.JoinedEvnet', (convData) => {
    // const firstNames = convData.consumerProfile.filter(e=>e.type=='personal').map(e=>e.personal.firstname);
    // mycard.elements[2].text = `Hello ${firstNames[0]||"visitor"},`
    echoAgent.publishEvent({
        dialogId: convData.id,
        event: {
            type: 'RichContentEvent',
            content: mycard
        }
    });
});


echoAgent.on('MyCoolAgent.ContentEvnet', (consumerEvent) => {
    echoAgent.publishEvent({
        dialogId: consumerEvent.dialogId,
        event: {
            type: 'ContentEvent',
            contentType: 'text/plain', 
            message: JSON.stringify(consumerEvent)
        }
    });
});