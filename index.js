const TelegramBot = require("node-telegram-bot-api");
const spawn = require("child-process-promise").spawn;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const BOT_NAME = "@JSAutomationGroupBot";

const options = {
  // Use pooling for local debug only.
  // polling: true
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  }
};
// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url =
  process.env.APP_URL || "https://js-automation-telegram-bot.herokuapp.com:443";
const bot = new TelegramBot(TELEGRAM_TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TELEGRAM_TOKEN}`);

// Sending message to myself on start, disable if to much spam
//bot.sendMessage(121956343, `My master, i am started at ${new Date()}`);

bot.onText(/\/execute .*/, async (msg, match) => {
  console.log("msg", msg);
  console.log("match", match);

  let toExecute = match.input.replace("/execute ", "");
  // Cleaning quotemarks autoreplacement
  toExecute = toExecute.replace("‘", "'");
  toExecute = toExecute.replace("’", "'");

  console.log("Code to execute: ", toExecute);
  // Timeout for long running commands
  const timeoutMarker = setTimeout(function() {
    bot.sendMessage(
      msg.chat.id,
      `Sorry, your code reached 1 min timeout: ${toExecute}`
    );
    childProcess.kill();
  }, 60000);
  const processPromise = spawn(
    "node",
    [`${__dirname}/executor.js`, "--code", Buffer.from(toExecute)],
    {
      capture: ["stdout", "stderr"]
    }
  )
    .then(function(result) {
      clearTimeout(timeoutMarker);
      console.log("[spawn] stdout: ", result.stdout.toString());
      bot.sendMessage(msg.chat.id, "Output: " + result.stdout.toString());
    })
    .catch(function(err) {
      clearTimeout(timeoutMarker);
      console.error("[spawn] stderr: ", err.stderr);
      bot.sendMessage(msg.chat.id, "Error output: " + err.stderr.toString());
    });
  const childProcess = processPromise.childProcess;
  console.log("[spawn] New process spawned: ", childProcess.pid);
});
