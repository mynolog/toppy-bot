import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const data = new SlashCommandBuilder()
  .setName("출석")
  .setDescription("오늘 출석 기록하기");

export async function execute(interaction: ChatInputCommandInteraction) {
  const allowedChannelId = process.env.CHECKIN_CHANNEL_ID!;

  if (interaction.channelId !== allowedChannelId) {
    return interaction.reply({
      content: "❌ 해당 명령어는 출석체크 채널에서만 사용할 수 있습니다.",
      flags: MessageFlags.Ephemeral,
    });
  }
  const user = interaction.user;
  const now = new Date();

  const dateText = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  await interaction.reply({
    content: `${user}님, ${dateText} 출석 완료!`,
    allowedMentions: { users: [user.id] },
  });
}
