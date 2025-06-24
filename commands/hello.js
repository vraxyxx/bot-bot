module.exports = {
  name: "hello",
  description: "Greet the user",
  run: async ({ api, event }) => {
    api.sendMessage("👋 Hello! Your bot is running on Render.", event.threadID, event.messageID);
  }
};