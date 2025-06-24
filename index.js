const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Keeps Render service alive
app.get("/", (_, res) => res.send("🤖 Autobot is alive on Render!"));
app.listen(PORT, () => console.log("🌐 Express server active."));

const login = require("ws3-fca");
const fs = require("fs-extra");
const path = require("path");

login({ appState: require("./appstate.json") }, async (err, api) => {
  if (err) return console.error("❌ Login Failed:", err);

  api.setOptions({ listenEvents: true });
  console.log("✅ Bot is running...");

  const commands = {};

  fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
    if (file.endsWith(".js")) {
      const cmd = require(`./commands/${file}`);
      commands[cmd.config.name] = cmd;
    }
  });

  api.listenMqtt((err, event) => {
    if (err || !event.body) return;

    const args = event.body.split(" ");
    const cmd = args[0].toLowerCase();

    if (commands[cmd]) {
      commands[cmd].run({ api, event, args });
    }
  });
});
