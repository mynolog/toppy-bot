import { ModalSubmitInteraction, MessageFlags } from "discord.js";
import { getTodayDateString } from "../lib/utils";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  const postUrl = interaction.fields.getTextInputValue("postUrl");
  const weeklyReflection =
    interaction.fields.getTextInputValue("weeklyReflection");

  const user = interaction.user;
  const today = getTodayDateString();

  try {
    await interaction.reply({
      content: `📅 ${today} \n \n${user}님, 블로그 포스팅 제출 완료! \n \n🔗 링크: ${postUrl} \n📝 회고: ${
        weeklyReflection || "없음"
      }`,
      allowedMentions: { users: [interaction.user.id] },
    });
  } catch (error) {
    console.error("제출 처리 오류:", error);
    return interaction.reply({
      content: "제출 처리 중 문제가 발생했습니다.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
