const TelegramBot = require("node-telegram-bot-api");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const BOT_NAME = "@HotTestingBot";

const HOT_TESTING_CHANNEL_ID = -1001465526599;
const HOT_TESTING_CHAT_ID = -1001144433746;
const MESSAGE_NEWS_THREAD_ID = 113567;

const options = {
  // Use pooling for local debug only.
  // polling: true,
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
  }
};
const url =
  process.env.APP_URL || "https://hot-testing-telegram-bot.herokuapp.com:443";
const bot = new TelegramBot(TELEGRAM_TOKEN, options);

bot.setWebHook(`${url}/bot${TELEGRAM_TOKEN}`);

bot.on('channel_post', ChanelPostCallback)

/**
 * @param {TelegramBot.Message} msg 
 */
async function ChanelPostCallback(msg) {
  console.log(JSON.stringify(msg, null, 2));
  if (msg.chat.id !== HOT_TESTING_CHANNEL_ID) {
    // Avoiding people to add this bot somewhere else.
    return;
  }

  // to, from, message_id
  await bot.forwardMessage(HOT_TESTING_CHAT_ID, HOT_TESTING_CHANNEL_ID, msg.message_id, {
    disable_notification: true,
    disable_web_page_preview: false,
  });

//   await bot.sendMessage(HOT_TESTING_CHAT_ID, 
// `https://t.me/Javascript_testing_channel/${msg.message_id}`, {
//     reply_to_message_id: MESSAGE_NEWS_THREAD_ID,
//     disable_notification: true,
//     disable_web_page_preview: false,
//   })
}

// Post in channel:
// https://t.me/Javascript_testing_channel/720
const exampleChannelPost = {
  "message_id": 723,
  "author_signature": "Alex Hot",
  "sender_chat": {
    "id": -1001465526599,
    "title": "Hot testing Channel",
    "username": "Javascript_testing_channel",
    "type": "channel"
  },
  "chat": {
    "id": -1001465526599,
    "title": "Hot testing Channel",
    "username": "Javascript_testing_channel",
    "type": "channel"
  },
  "date": 1686057114,
  "text": "test2"
};


// Message in thread:
// https://t.me/js_for_testing/113551/113567
const exampleThread = {
  "message_id": 113563,
  "from": {
    "id": 121956343,
    "is_bot": false,
    "first_name": "Alex",
    "last_name": "Hot",
    "username": "xotabu4",
    "language_code": "en"
  },
  "chat": {
    "id": -1001144433746,
    "title": "Hot testing",
    "username": "js_for_testing",
    "is_forum": true,
    "type": "supergroup"
  },
  "date": 1686047163,
  "message_thread_id": 113551,
  "reply_to_message": {
    "message_id": 113551,
    "from": {
      "id": 121956343,
      "is_bot": false,
      "first_name": "Alex",
      "last_name": "Hot",
      "username": "xotabu4",
      "language_code": "en"
    },
    "chat": {
      "id": -1001144433746,
      "title": "Hot testing",
      "username": "js_for_testing",
      "is_forum": true,
      "type": "supergroup"
    },
    "date": 1686043165,
    "message_thread_id": 113551,
    "forum_topic_created": {
      "name": "News",
      "icon_color": 7322096
    },
    "is_topic_message": true
  },
  "text": "test",
  "is_topic_message": true
}