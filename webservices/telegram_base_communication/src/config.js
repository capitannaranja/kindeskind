var config = {};

/**
 * HTTP basic auth settings
 */
config.username = "kindeskind";
config.password = "H3aLyUnB3fxfyfTNNZq7JDwp";

/**
 * telegram-cli paths
 */
config.pathToTelegramCLI = "/usr/src/app/tg/bin/telegram-cli";
config.pathToTelegramDir = "/usr/src/app/tg";

/**
 * telegram-history-dump paths
 */
config.pathToJSONLFiles = "/usr/src/app/telegram-history-dump/output/json";
config.pathToHistoryDumpScript = "/usr/src/app/telegram-history-dump/telegram-history-dump_extended.rb;"

/**
 * server port
 */
config.serverPort = 3000;

module.exports = config;