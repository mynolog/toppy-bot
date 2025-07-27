import dotenv from "dotenv";
import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import { execute } from "./commands/checkIn";
import { startRemiderScheduler } from "./jobs/reminderScheduler";

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

client.on("guildMemberAdd", async (member) => {
  const role = member.guild.roles.cache.find((r) => r.name === "편집자");
  if (role) {
    try {
      await member.roles.add(role);
      console.log(`🎉 ${member.user.tag}님에게 '편집자' 역할 부여됨`);
    } catch (error) {
      console.error("❌ 역할 부여 실패:", error);
    }
  } else {
    console.warn("⚠️ '편집자' 역할을 찾을 수 없습니다");
  }
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
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
