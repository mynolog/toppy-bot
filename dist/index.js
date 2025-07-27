"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const checkIn_1 = require("./commands/checkIn");
dotenv_1.default.config({ path: ".env.local" });
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
client.once("ready", () => {
    console.log(`🤖 Logged in as ${client.user?.tag}`);
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === "출석") {
        try {
            await (0, checkIn_1.execute)(interaction);
        }
        catch (error) {
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
