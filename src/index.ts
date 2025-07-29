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
        name: "보고만 있을게요... (아마도) 💬",
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
