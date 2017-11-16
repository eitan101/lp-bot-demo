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

echoAgent.on('MyCoolAgent.ContentEvnet', (contentEvent) => {
    if (contentEvent.message && contentEvent.message.startsWith('#rich')) {
        echoAgent.publishEvent({
            dialogId: contentEvent.dialogId,
            event: {
                type: 'RichContentEvent',
                content: mycard
            }
        }, null, [{ type: "ExternalId", id: "MY_CARD_ID" }]);
    } else {
        echoAgent.publishEvent({
            dialogId: contentEvent.dialogId,
            event: {
                type: 'ContentEvent',
                contentType: 'text/plain',
                message: JSON.stringify(contentEvent)
            }
        });
    }
});