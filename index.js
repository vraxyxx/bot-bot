const login = require("ws3-fca");
const fs = require("fs-extra");
const path = require("path");

login({ appState: require("./appstate.json") }, async (err, api) => {
  if (err) return console.error("Login Failed:", err);

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    forceLogin: true
  });

  console.log("🤖 Bot is now active!");

  const commands = {};

  // Load commands
  fs.readdirSync(__dirname + "/commands").forEach(file => {
    if (file.endsWith(".js")) {
      const cmd = require(`./commands/${file}`);
      commands[cmd.config.name] = cmd;
    }
  });

  // Listen to messages
  api.listenMqtt((err, event) => {
    if (err || !event.body) return;

    const args = event.body.split(" ");
    const commandName = args[0].toLowerCase();

    if (commands[commandName]) {
      commands[commandName].run({ api, event, args });
    }
  });
});
