import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { execute } from "./commands/checkIn";

dotenv.config({ path: ".env.local" });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "출석") {
    try {
      await execute(interaction);
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "출석 처리 중 오류가 발생했습니다.",
          ephemeral: true,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
