import dotenv from "dotenv";
import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import { startRemiderScheduler } from "./jobs/reminderScheduler";
import onGuildMemberAdd from "./events/guildMemberAdd";
import onInteractionCreate from "./events/interactionCreate";

dotenv.config({ path: ".env.local" });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
  startRemiderScheduler(client);
});

client.on("guildMemberAdd", onGuildMemberAdd);
client.on("interactionCreate", onInteractionCreate);

client.login(process.env.DISCORD_TOKEN);
