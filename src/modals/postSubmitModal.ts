import { ModalSubmitInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { getTodayDate } from "../lib/utils";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  const postUrl = interaction.fields.getTextInputValue("postUrl");
  const weeklyReflection =
    interaction.fields.getTextInputValue("weeklyReflection");

  const user = interaction.user;
  const { todayText } = getTodayDate();

  try {
    const embed = new EmbedBuilder()
      .setTitle("📮 블로그 포스팅 제출")
      .setColor(0x5dbcd2)
      .addFields(
        { name: "📅 제출일", value: todayText, inline: false },
        { name: "👤 작성자", value: `${user}`, inline: false },
        { name: "🔗 포스팅 링크", value: postUrl || "없음", inline: false },
        { name: "📝 회고", value: weeklyReflection || "없음", inline: false }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      allowedMentions: { users: [user.id] },
    });
  } catch (error) {
    console.error("제출 처리 오류:", error);
    return interaction.reply({
      content: "제출 처리 중 문제가 발생했습니다.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
