'use strict';

const MyCoolAgent = require('./MyCoolAgent');

const echoAgent = new MyCoolAgent({
    accountId: process.env.LP_ACCOUNT,
    username: process.env.LP_USER,
    appKey: process.env.LP_APP_KEY,
    secret: process.env.LP_APP_SECRET,
    accessToken: process.env.LP_APP_AT,
    accessTokenSecret: process.env.LP_APP_AT_SECRET
});

    
echoAgent.on('MyCoolAgent.ContentEvnet', (contentEvent) => {
    if (contentEvent.message.startsWith('#transfer')) {
        echoAgent.updateConversationField({ 
            conversationId: contentEvent.dialogId, 
            conversationField: [
                { field: "ParticipantsChange", type: "REMOVE", role: "ASSIGNED_AGENT" },
                { field: "Skill", type: "UPDATE", skill: "51697513" }
            ]
        }, null, [{ type: "ActionReason", reason: "I didn't understand the consumer" }]);
    } else {
        var businessCase = undefined;
        if (contentEvent.message.includes("pay"))
            businessCase = "pay_my_bill";
        else if (contentEvent.message.includes("password"))
            businessCase = "change_password";
        else if (contentEvent.message.includes("buy"))
            businessCase = "buy_something";
            
        echoAgent.publishEvent({
            dialogId: contentEvent.dialogId,
            event: {
                type: 'ContentEvent',
                contentType: 'text/plain', 
                message: "I will check and get back to you."
            }
        }, null , [{
            type:"BotResponse",
            businessCases:[businessCase||"unknown"]
        }]);
    }
});