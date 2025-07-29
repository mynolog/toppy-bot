import express from "express";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { startRemiderScheduler } from "./jobs/reminderScheduler";
import onGuildMemberAdd from "./events/guildMemberAdd";
import onInteractionCreate from "./events/interactionCreate";
import { ENV } from "./config/env";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);

  client.user?.setPresence({
    activities: [
      {
        name: "여러분의 글을 기다리는 중.. 💬",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });

  startRemiderScheduler(client);
});

client.on("guildMemberAdd", onGuildMemberAdd);
client.on("interactionCreate", onInteractionCreate);

client.login(ENV.DISCORD_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/healthz", (_, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`✅ Health check server running on port ${PORT}`);
});
