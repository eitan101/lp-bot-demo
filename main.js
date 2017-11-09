'use strict';

/*
 * This demo extends MyCoolAgent with the specific reply logic: 
 * 
 * 1) Echo any new message from the consumer
 * 2) Close the conversation if the consumer message starts with '#close' 
 * 
 */

const MyCoolAgent = require('./MyCoolAgent');
var fs = require('fs');
var mycard = JSON.parse(fs.readFileSync('./content/card.json', 'utf8'));
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
    
    // password: process.env.LP_PASS,
    // For internal lp only use 
    //  export LP_CSDS=hc1n.dev.lprnd.net
    csdsDomain: process.env.LP_CSDS
});

echoAgent.on('MyCoolAgent.JoinedEvnet', (convData) => {
    console.dir("joined",convData);
});
    
echoAgent.on('MyCoolAgent.ContentEvnet', (contentEvent) => {
    if (contentEvent.message.startsWith('#close')) {
        echoAgent.updateConversationField({
            conversationId: contentEvent.dialogId,
            conversationField: [{
                field: "ConversationStateField",
                conversationState: "CLOSE"
            }]
        });
    } else if (contentEvent.message.startsWith('#transfer')) {
        echoAgent.updateConversationField({ "conversationId": contentEvent.dialogId, "conversationField": [{ "field": "Skill", "type": "UPDATE", "skill": "51697513" }, { "field": "ParticipantsChange", "type": "REMOVE", "role": "ASSIGNED_AGENT" }] },
            null,
            [{ "type": "ActionReason", "reason": "I didn't understand the guy" }]);
    } else {
        // echoAgent.publishEvent({
        //     dialogId: contentEvent.dialogId,
        //     event: {type: "AcceptStatusEvent", status: "READ", sequenceList: [contentEvent.sequence]}
        // }, (e,r)=>{
        //     console.dir(e);
        //     console.dir(r);
        // }, [{"type":"BotResponse","intents":[{"id":"pay_may_bill","confidence":0.8}]}]);

        var country = contentEvent.message;
        jsonReq.get({ url: `https://restcountries.eu/rest/v2/name/${country}?fields=capital`}, 
        (e,r,b)=>{
            if (b && b[0] && b[0].capital) {
                mycard.elements[1].text = b[0].capital;
                mycard.elements[0].url = `https://source.unsplash.com/featured/?${b[0].capital}`
            } else {
                mycard.elements[1].text = "Don't know";                
                mycard.elements[0].url = `https://source.unsplash.com/random`
            }
                // console.log(b[0].capital);
            // console.log("don't know");

            echoAgent.publishEvent({
                dialogId: contentEvent.dialogId,
                event: {
                    type: 'RichContentEvent',
                    content: mycard
                }
            }, null , [
                {"type":"BotResponse","businessCases":["pay_somehting_else"],"intents":[{"id":"pay_may_bill","confidence":"HIGH","confidenceScore": 0.8}]},
                {
                    "type": "EscalationSummary",
                    "conversationDuration": 60000,
                    "escalationCause": "escalated_by_configuration",
                    "escalatedDuringBusinessCase": "pay_bill1",
                    "businessCases": [{"id": "hi","time": 1510145284956}]
                }
            ],(e,r)=>{
                console.dir(e);
                console.dir(r);
            });    
        });


    }
});