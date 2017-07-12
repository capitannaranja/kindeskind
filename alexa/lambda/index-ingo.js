'use strict';
var Alexa = require('alexa-sdk');
var http = require("http");

var serverHostName = "54.93.32.29";
var serverPort = "3001";
var severAuth = "Basic a2luZGVza2luZDpIM2FMeVVuQjNmeGZ5ZlROTlpxN0pEd3A=";
var userName = "Ingo";
var contactName = 'Marco';

/**
 * Intent Handler
 */
exports.handler = (event, context, callback) => {
    var alexa = Alexa.handler(event, context);

    alexa.registerHandlers(newSessionHandlers, startHandlers, sendMessageHandlers, getMessageHandlers);
    alexa.execute();
};

var states = {
    STARTMODE: '_STARTMODE', //State when Kindeskind is started without further command
    GETMODE: '_GETMODE', // State which reads out messages to the user
    SENDMODE: '_SENDMODE'  // State for sending messages
};

/**
 * NEW SESSION
 */
var newSessionHandlers = {
    /**
     * Triggered when the user opens the skill with no furter command.
     * Asks the user whether he wants to send or get a message.
     * Sends state to STARTMODE.
     */
    'LaunchRequest': function () {
        this.handler.state = states.STARTMODE;
        this.emit(":ask", 'Hallo ' + userName + '. Möchtest du eine Nachricht senden oder empfangen?', 'Sage "Senden", um eine Nachricht zu senden oder "Empfangen", um eine erhaltene Nachricht vorgelesen zu bekommen');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "Ade!");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "Ade!");
    },
    'SessionEndedRequest': function () {
        this.emit(":tell", "Ade!");
    },
    /**
     * Triggered when the user opens the skill directly with the "send" command.
     * Sets the state to SENDMODE.
     */
    'SendIntent': function () {
        console.log("SEND INTENT");
        this.handler.state = states.SENDMODE;
        this.emit(':ask', 'Hallo ' + userName + '! Welche Nachricht möchtest du senden?', 'Bitte diktiere mir jetzt deine Nachricht')
    },
    /**
     * Triggered when the user opens the skill directly with the "get" command.
     * Sets the state to GETMODE.
     */
    'GetIntent': function () {
        console.log("GET INTENT");
        this.handler.state = states.GETMODE;
        this.emitWithState("NewSession");
    },
    'AMAZON.HelpIntent': function () {
        let message = 'Sage "Senden", um eine Nachricht zu senden oder "Empfangen", um eine erhaltene Nachricht vorgelesen zu bekommen';
        this.emit(':ask', message, message);
    },
    'Unhandled': function () {
        let message = 'Sage "Senden", um eine Nachricht zu senden oder "Empfangen", um eine erhaltene Nachricht vorgelesen zu bekommen';
        this.emit(':ask', message, message);
    },
};

/**
 * STARTMODE
 */
var startHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.HelpIntent': function () {
        let message = 'Sage "Senden", um eine Nachricht zu senden oder "Empfangen", um eine erhaltene Nachricht vorgelesen zu bekommen.';
        this.emit(':ask', message, message);
    },
    'AMAZON.StopIntent': function () {
        console.log("STOPINTENT");
        this.emit(':tell', "Ade!");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "Ade!");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "Ade!");
    },
    'Unhandled': function () {
        let message = 'Sage Hilfe, um Anweisungen zu bekommen oder Stop, um die Anwendung zu beenden.';
        this.emit(':ask', message, message);
    },
    /**
     * Triggered when the user opened the skill with no furter command and then
     * decided to call the "send" command.
     * Sets the state to SENDMODE
     */
    'StartSendIntent': function () {
        this.handler.state = states.SENDMODE;
        this.emit(':ask', 'Welche Nachricht möchtest du senden?', 'Bitte diktiere mir jetzt deine Nachricht!');
    },
    /**
     * Triggered when the user opened the skill with no furter command and then
     * decided to call the "get" command.
     * Sets the state to GETMODE
     */
    'StartGetIntent': function () {
        this.handler.state = states.GETMODE;
        this.emitWithState("NewSession");
    }
});

/**
 * SENDMODE
 */
var sendMessageHandlers = Alexa.CreateStateHandler(states.SENDMODE, {
    'AMAZON.HelpIntent': function () {
        let message = 'Mit Kindeskind kannst du eine Nachricht senden. Bitte diktiere mir jetzt deine Nachricht.';
        this.emit(':ask', message, message);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "Ade!");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "Ade!");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "Ade!");
    },
    'Unhandled': function () {
        let message = 'Bitte diktiere mir jetzt deine Nachricht oder sage "Stop", um die Anwendung zu beenden.';
        this.emit(':ask', message, message);
    },

    /**
     * Triggered when state is set to SENDMODE.
     * The message to send is get from the stringified user input 
     * and then sent to the server with a Post Request.
     */
    'RawText': function () {
        let message = this.event.request.intent.slots.messageText.value;

        sendTelegramMessage(message, myResult => {
            this.emit(':tell', 'Deine Nachricht wurde gesendet');
        });
    }
});

/**
 * GETMODE
 */
var repeatMessage = "Du hast keine weiteren Nachrichten";

var getMessageHandlers = Alexa.CreateStateHandler(states.GETMODE, {

    /**
     * Triggered when state is set to SENDMODE.
     * Gets messages from the server with the Get Request and reads it out to the user.
     * If no new message is found, an alternative message is read.
     * The state is then set to GETMODE again to give the user the possibilty to make further intents.
     * This is used for repeating the message.
     */
    "NewSession": function () {
        this.emit('NewSession');

        receiveTelegramMessages((myResult) => {
            repeatMessage = myResult;

            if (repeatMessage === 'noMessage') {
                this.emit(':tell', 'Du hast keine neuen Nachrichten', 'Du hast keine neuen Nachrichten');
            }
            let toldMessage = 'Hallo! Du hast eine neue Nachricht von ' + contactName + ': <break time="0.3s"/>' + myResult + '<break time="1s"/> Soll ich die Nachricht wiederholen?';
            this.emit(':ask', toldMessage, "Wenn ich die Nachricht wiederholen soll, sage jetzt bitte Ja.");
        });

        this.handler.state = states.GETMODE;
    },
    //Repeats the message if the user triggers this intent by saying "yes".
    "AMAZON.YesIntent": function () {
        this.emit(':tell', repeatMessage);
    },
    //Does not repeat the message if the user triggers this intent by saying "no".
    "AMAZON.NoIntent": function () {
        this.emit(':tell', "Bis bald!");
    },
    "AMAZON.HelpIntent": function () {
        let message = 'Mir ist leider ein Fehler unterlaufen. Bitte sage "Stop" und öffne Kindeskind erneut';
        this.emit(':ask', message, message);
    },
    "AMAZON.StopIntent": function () {
        this.emit(':tell', "Ade!");
    },
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', "Ade!");
    },
    "SessionEndedRequest": function () {
        this.emit(':tell', "Ade!");
    },
    'Unhandled': function () {
        let message = 'Sage Hilfe, um Anweisungen zu bekommen oder Stop, um die Anwendung zu beenden.';
        this.emit(':ask', message, message);
    }
});

// END of Intent Handlers ---------------------------------------------------------------------

/**
 * sendTelegramMessage
 * Post Request to send the user input as telegram message.
 */
function sendTelegramMessage(myMessage, callback) {

    let post_data = { "msg": myMessage };

    let options = {
        "method": "POST",
        "hostname": serverHostName,
        "port": serverPort,
        "path": "/telegram/msg",
        "headers": {
            "content-type": "application/json",
            "authorization": severAuth,
            "cache-control": "no-cache"
        }
    };

    let req = http.request(options, (res) => {
        let chunks = [];

        res.on("data", (chunk) => {
            chunks.push(chunk);
        });

        res.on("end", function () {
            let body = Buffer.concat(chunks);
            console.log(body.toString());

            let callbackData1 = 500;
            callback(callbackData1);
        });
    });

    req.write(JSON.stringify(post_data));
    req.end();
}

/**
 * receiveTelegramMessages
 * Get Request that returns a JSON object. 
 * The messages are returned in callback.
 */
function receiveTelegramMessages(callback) {

    let options = {
        "method": "GET",
        "hostname": serverHostName,
        "port": serverPort,
        "path": "/telegram/unreadmsg/all",
        "headers": {
            "content-type": "application/json",
            "authorization": severAuth,
            "cache-control": "no-cache",
        }
    };

    let req = http.request(options, res => {
        res.setEncoding('utf8');
        let returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', function () {

            let json = JSON.parse(returnData);

            // Check if there is message of sender
            let hasMessageOfSender = false;
            let counter = 0;
            for (let item in json) {
                for (let senderName in (json[item])) {
                    if (contactName === senderName) {
                        hasMessageOfSender = true;
                    }
                    if (hasMessageOfSender) break;
                    counter++;
                }
            }
            let message = 'noMessage';
            if (hasMessageOfSender) {
                if (json[counter][contactName][0] === undefined) {
                    message = 'noMessage';
                } else {
                    message = json[counter][contactName][0].text;
                }
            }

            callback(message);
        });
    });
    req.end();
}
