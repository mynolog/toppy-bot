import {
  SlashCommandBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { ENV } from "../config/env";

export const data = new SlashCommandBuilder()
  .setName("제출")
  .setDescription("이번 주 포스팅 제출하기");

export async function execute(interaction: ChatInputCommandInteraction) {
  const allowedChannelId = ENV.POSTING_CHANNEL_ID;
  if (interaction.channelId !== allowedChannelId) {
    return interaction.reply({
      content: "❌ 해당 명령어는 포스팅제출 채널에서만 사용할 수 있습니다.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const modal = new ModalBuilder()
    .setCustomId("postSubmitModal")
    .setTitle("포스팅 제출");

  const urlInput = new TextInputBuilder()
    .setCustomId("postUrl")
    .setLabel("포스팅 URL")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const reflectionInput = new TextInputBuilder()
    .setCustomId("weeklyReflection")
    .setLabel("이번 주 회고 (선택)")
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(500)
    .setRequired(false);

  const urlRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    urlInput
  );
  const reflectionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    reflectionInput
  );

  modal.addComponents(urlRow);
  modal.addComponents(reflectionRow);
  await interaction.showModal(modal);
}
