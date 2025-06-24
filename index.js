const login = require("./ws3-fca");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config");

const prefix = config.prefix;
const commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, "commands"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

const appState = require("./appstate.json");

login({ appState }, (err, api) => {
  if (err) return console.error("❌ Login failed:", err);
  console.log("✅ Bot is now running!");

  api.setOptions({ listenEvents: true });

  api.listenMqtt((err, event) => {
    if (err || event.type !== "message" || !event.body) return;

    if (!event.body.startsWith(prefix)) return;
    const args = event.body.slice(prefix.length).trim().split(/\s+/);
    const cmd = args.shift().toLowerCase();

    if (commands.has(cmd)) {
      const command = commands.get(cmd);
      command.run({ api, event, args });
    }
  });
});