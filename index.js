const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => res.send("🤖 Autobot is alive on Render!"));
app.listen(PORT, () => console.log("🌐 Express server started"));

const login = require("ws3-fca");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config");

login({ appState: require("./appstate.json") }, async (err, api) => {
  if (err) return console.error("❌ Login failed:", err);

  api.setOptions({
    listenEvents: true,
    forceLogin: true,
    selfListen: false,
    logLevel: "silent"
  });

  console.log("✅ Bot is logged in.");

  const commands = {};

  fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
    if (file.endsWith(".js")) {
      const cmd = require(`./commands/${file}`);
      commands[cmd.config.name] = cmd;
      console.log(`🧩 Loaded: ${cmd.config.name}`);
    }
  });

  api.listenMqtt((err, event) => {
    if (err || !event.body) return;

    console.log("📥 Message:", event.body);

    const args = event.body.trim().split(/\s+/);
    const cmdName = args[0].toLowerCase();

    if (commands[cmdName]) {
      commands[cmdName].run({ api, event, args });
    }
  });
});
