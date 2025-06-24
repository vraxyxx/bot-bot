const express = require("express");
require("npmlog"); // ensure it's loaded
const login = require("ws3-fca");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config");

const app = express();
app.get("/", (_, res) => res.send("🤖 Autobot is alive!"));
app.listen(process.env.PORT || 3000, () => console.log("🌐 Express started"));

login({ appState: require("./appstate.json") }, (err, api) => {
  if (err) {
    console.error("❌ Login failed:");
    console.dir(err, { depth: null });
    return;
  }
  console.log("✅ Logged into FB");

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    logLevel: "silent"
  });

  const commands = {};
  fs.readdirSync(path.join(__dirname, "commands"))
    .filter(f => f.endsWith(".js"))
    .forEach(f => {
      commands[require(`./commands/${f}`).config.name] = require(`./commands/${f}`);
      console.log("🧩 Loaded:", f);
    });

  api.listenMqtt((err, event) => {
    if (err || !event.body) return;
    const args = event.body.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    console.log("📥", event.body);
    if (commands[cmd]) commands[cmd].run({ api, event, args });
  });
});
