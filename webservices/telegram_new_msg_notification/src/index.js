var express = require('express');
var app = express();
var helper = require('./helper.js');
var config = require('./config.js');
var SimpleTelegram = require('simple-telegram');
var stg = new SimpleTelegram();


/**
 * Simple Telegram initialization
 */
var tgBinFile = config.pathToTelegramCLI;
var tgKeysFile = config.pathToTelegramDir + "/tg-server.pub";
// simpleTelegram object
stg.create(tgBinFile, tgKeysFile);


/**
 * Handle new message received event
 * Turn on signal light when new message is received
 */
stg.getProcess().stdout.on("receivedMessage", function (msg) {
  console.log("\nReceived message");
  console.dir(msg);
  helper.turnOnMsgSignal().then(
    function (result) {
      console.log(result);
    }, function (err) {
      console.log(err);
    });
});

/**
 * Make NodeJS server listen on specific port
 */
app.listen(config.serverPort, function () {
  console.log('App running on ' + config.serverPort);
});