const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (_, res) => res.send("🟢 Messenger Bot Running"));
app.listen(PORT, () => console.log("🌐 Express server active"));

const login = require("ws3-fca");
const fs = require("fs-extra");

login({ appState: require("./appstate.json") }, async (err, api) => {
  if (err) return console.error("Login Failed:", err);

  api.setOptions({ listenEvents: true });

  console.log("🤖 Bot is running...");

  api.listenMqtt((err, event) => {
    if (err || !event.body) return;

    if (event.body === "ping") {
      api.sendMessage("pong", event.threadID, event.messageID);
    }
  });
});
