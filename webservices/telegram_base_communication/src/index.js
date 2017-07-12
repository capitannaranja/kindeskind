var express = require('express');
var compression = require('compression');
var app = express();
var exec = require('child_process').exec;
var helper = require('./helper.js');
var bodyParser = require('body-parser');
var encoding = require("encoding");
var basicAuth = require('express-basic-auth');
var config = require('./config.js');
var fs = require('fs');

/**
 * Apply express bodyParser middleware to handle json format
 */
app.use(bodyParser.json());         //support JSON-encoded bodies
app.use(bodyParser.urlencoded({     //support URL-encoded bodies
  extended: true
}));

/**
 * Set HTTP header of response to return json as mime type
 */
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(compression());

/**
 * Set HTTP basic authentication
 */
var key = config.username;
var credentials = {
  [key]: config.password
};
app.use(basicAuth({
  users: credentials
}));


/**
 * Initial loading of json message backup files for debug purposes
 */
helper.getAllJSONLFilenames()
  .then((fulfilled) => {
    console.log("Promise: ");
    console.dir(fulfilled);
    //tmp.pathToFile.replace(".jsonl", "");
  })
  .catch((error) => {
    console.log(error.message);
  });

/**
 * Invoke a telegram-cli command
 */
app.post('/telegram/command', function (req, res) {

  var result = {
    "stdout": "",
    "stderr": "",
    "error": ""
  };

  //Check if JSON Object is complete
  if (req.body.command == null || req.body.param1 == null || req.body.param2 == null) {
    result.error = "Body JSON not complete"
    res.json(result);
    return;
  }
  /**
   * Optional: prevent misusage of telegram commands by limiting to 'msg' command only
   */
  /*
  else if (req.body.command != "msg") {   //prevents misusage - only 'msg' command allowed
    //else if(!(req.body.command == "msg" || req.body.command == "contact_list")){   //prevents misusage - only 'msg' and 'contact_list' command allowed
    result.error = "Command not allowed"
    res.json(result);
    return;
  }
  */
  else {
    var command = req.body.command;
    var param1 = req.body.param1;
    var param2 = req.body.param2;
  }

  var telegramCommand = helper.buildTelegramCommand(config.pathToTelegramCLI, command, param1, param2);
  exec(telegramCommand, function (error, stdout, stderr) {
    if (stdout !== null) {
      stdout = helper.formatTelegramOutput(stdout);
      result.stdout = stdout;
    }
    if (stderr !== null) {
      result.stderr = stderr;
    }
    if (error !== null) {
      result.error = error;
    }

    // Send result to Client
    res.json(result);
  });
});

/**
 * Invoke telegram-cli 'msg' command
 */
app.post('/telegram/msg', function (req, res) {

  var command = "msg";
  var param1 = "Marco";
  var result = {
    "stdout": "",
    "stderr": "",
    "error": ""
  };

  //Check if JSON Object is complete
  if (req.body.msg == null) {
    result.error = "Body JSON not complete"
    res.json(result);
    return;
  } else {
    var msg = req.body.msg;
  }

  var telegramCommand = helper.buildTelegramCommand(config.pathToTelegramCLI, command, param1, msg);
  exec(telegramCommand, function (error, stdout, stderr) {
    if (stdout !== null) {
      stdout = helper.formatTelegramOutput(stdout);
      result.stdout = stdout;
    }
    if (stderr !== null) {
      result.stderr = stderr;
    }
    if (error !== null) {
      result.error = error;
    }

    //Send result to Client
    res.json(result);
  });
});

/**
 * Get all unread messages of all contacts
 */
app.get('/telegram/unreadmsg/all', (req, res) => {

  var result = [];

  var telegramCommand = config.pathToHistoryDumpScript;
  exec(telegramCommand, function (error, stdout, stderr) {

    if (stdout !== null) {
      helper.getAllJSONLFilenames()
        .then((fulfilled) => {
          console.log("Promise: ");
          console.dir(fulfilled);
          fulfilled.forEach(jsonlFilename => {
            console.log(jsonlFilename.replace(".jsonl", ""));
            var senderName = jsonlFilename.replace(".jsonl", "");
            result.push(helper.getUnreadMessagesOfSender(senderName, jsonlFilename));
          });

          /**
           * Optional: Concatenation of multiple messages to one message text field
           */
          /*
          //concatenate multiple message texts to one
          let resultArr = [];
          //for (let [key, value] of Object.entries(myObject)){
          for (let senderObj of Array.from(result)) {
            let senderName = Object.keys(senderObj)[0];
            let senderMsgArr = senderObj[senderName];
            if (senderMsgArr.length <= 0) {
              resultArr.push(senderObj);
              continue;
            }
            let resultSenderMsgObj = {};
            let counter = 0;
            for (let senderMsgObj of Array.from(senderMsgArr.reverse())) {
              if (counter === 0) {
                resultSenderMsgObj = senderMsgObj;
              }
              else {
                resultSenderMsgObj.text += ". " + senderMsgObj.text;
              }
              counter++;
            }
            senderMsgArr = [];
            senderMsgArr.push(resultSenderMsgObj);

            senderObj[senderName] = senderMsgArr;
            resultArr.push(senderObj);
          }
          result = resultArr;
          */

          // Turn off signal light when messages are marked as read
          helper.turnOffMsgSignal().then(
            function (result) {
              console.log(result);
            }, function (err) {
              console.log(err);
            });

          res.json(result);
        })
        .catch((error) => {
          console.log("ERROR in route /telegram/unreadmsg/all: " + error.message);
        });
    }
  });
});

/**
 * Make NodeJS server listen on specific port
 */
app.listen(config.serverPort, function () {
  console.log('App running on ' + config.serverPort);
});