import { Interaction, MessageFlags } from "discord.js";
import { execute } from "../commands/checkIn";

export default async function onInteractionCreate(interaction: Interaction) {
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
}
