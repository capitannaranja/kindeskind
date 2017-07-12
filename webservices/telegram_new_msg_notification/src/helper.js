var stripAnsi = require('strip-ansi');
var personalization = require('./personalization/personalization.js');
const fs = require('fs');
var https = require('https');

var helper = {};

/**
 * Turn signal light on (if state is true) or off (if state is false)
 * Calls REST API of myopenhab.org
 */
helper.setSignalLightState = (state) => {

    var data = "";
    if (state == true) {
        data = personalization.signalColor;
    }
    else {
        data = "0,0,0";
    }

    var options = {
        host: 'myopenhab.org',
        path: '/rest/items/hue_0210_0017881c3123_2_color',
        port: '443',
        method: 'POST',
        headers: {
            "content-type": "text/plain",
            "authorization": "Basic Y2hyaXN0b2Yua29zdEBnbWFpbC5jb206a2luZGVza2luZGJlc2NoZGU=",
            "cache-control": "no-cache"
        }
    };

    var request = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    request.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    request.write(data);
    request.end();
};

/**
 * Turn on signal light (when message is received)
 */
helper.turnOnMsgSignal = () => {
    return new Promise((resolve, reject) => {
        helper.setSignalLightState(true);
        resolve("Signal light: on");
    });
};

module.exports = helper;