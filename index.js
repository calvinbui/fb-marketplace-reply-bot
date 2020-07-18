const yaml = require("js-yaml");
const login = require("facebook-chat-api");
const fs = require("fs");

const db = yaml.safeLoad(fs.readFileSync("replies.yaml", "utf8"));
console.log("Database loaded");
console.log(db);

login(
  {
    email: process.env.fb_username,
    password: process.env.fb_password,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
  },
  (err, api) => {
    if (err) {
      process.exit(1);
    }

    console.log("Bot started");
    // reply when i talk to myself
    api.setOptions({
      listenEvents: true,
      selfListen: true,
      // Choose from either `"silly"`, `"verbose"`, `"info"`, `"http"`, `"warn"`, `"error"`, or `"silent"`.
      logLevel: "http",
    });

    api.listenMqtt((err, message) => {
      if (err) {
        process.exit(1);
      }

      // send reply
      function sendReply(reply) {
        console.log(
          `Replying to ${message.body} with ${reply} to ${message.senderID}`
        );
        api.sendMessage({ body: reply }, message.threadID);
      }

      if (err) {
        process.exit(1);
      }
      // loop through replies array
      for (let reply = 0; reply < db.replies.length; reply++) {
        // loop through each reply's message
        for (let message = 0; message < db.replies[reply].message.length; message++) {
          // test if regex matches
          if (
            RegExp(
              `(^|\\s)["']?${db.replies[reply].message[message]}[.!?]?["']?[,.]?(?!\\S)`,
              "i"
            ).test(message.body)
          ) {
            console.log(`Message received: ${message.body}`);
            sendReply(db.replies[reply].response);
            break;
          }
        }
      }
    });
  }
);
