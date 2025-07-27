"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.local" });
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("출석")
    .setDescription("오늘 출석 기록하기");
async function execute(interaction) {
    const allowedChannelId = process.env.CHECKIN_CHANNEL_ID;
    if (interaction.channelId !== allowedChannelId) {
        return interaction.reply({
            content: "❌ 해당 명령어는 출석체크 채널에서만 사용할 수 있습니다.",
            flags: discord_js_1.MessageFlags.Ephemeral,
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
