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

var mycard = JSON.parse(fs.readFileSync('./content/card.json', 'utf8'));

echoAgent.on('MyCoolAgent.ContentEvnet', (contentEvent) => {
    echoAgent.publishEvent({
        dialogId: contentEvent.dialogId,
        event: {
            type: 'RichContentEvent',
            content: mycard
        }
    });
});