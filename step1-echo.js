'use strict';

const MyCoolAgent = require('./MyCoolAgent');

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
    echoAgent.publishEvent({
        dialogId: contentEvent.dialogId,
        event: {
            type: 'ContentEvent',
            contentType: 'text/plain', 
            message: contentEvent.message
        }
    });
});