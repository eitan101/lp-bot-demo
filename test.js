

const jsonReq = require('request').defaults({
    'json': true
});

// let coutry = 'united states of america';
let coutry = 'Kingdom';
jsonReq.get({ url: `https://restcountries.eu/rest/v2/name/${coutry}?fields=capital`}, 
(e,r,b)=>{
    if (b && b[0] && b[0].capital)
        console.log(b[0].capital);
    else
        console.log("don't know");
});