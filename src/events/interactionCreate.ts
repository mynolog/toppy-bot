import { Interaction, MessageFlags } from "discord.js";
import { execute as checkInExecute } from "../commands/checkIn";
import { execute as submitPostExeute } from "../commands/submitPost";
import { handleModalSubmit } from "../modals/postSubmitModal";

export default async function onInteractionCreate(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "출석") {
      await checkInExecute(interaction);
    }
    if (interaction.commandName === "제출") {
      await submitPostExeute(interaction);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "postSubmitModal") {
      await handleModalSubmit(interaction);
    }
  }
}
