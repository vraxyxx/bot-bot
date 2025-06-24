document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("command-list");

  const commands = [
    { name: "ping", description: "Responds with pong" },
    { name: "help", description: "Lists all available commands" },
    { name: "uptime", description: "Shows bot uptime" },
    { name: "stalk", description: "Get Facebook user info" },
    { name: "spotify", description: "Search Spotify for music" },
    { name: "emoji", description: "Sends a random emoji style" },
    { name: "namechange", description: "Change profile name" }
  ];

  commands.forEach(cmd => {
    const li = document.createElement("li");
    li.textContent = `🔹 ${cmd.name} – ${cmd.description}`;
    list.appendChild(li);
  });
});
