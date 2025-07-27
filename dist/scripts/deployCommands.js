"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const checkIn_1 = require("../commands/checkIn");
dotenv_1.default.config({ path: ".env.local" });
const commands = [checkIn_1.data.toJSON()];
const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log("슬래시 커맨드 등록 시작");
        await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands });
        console.log("슬래시 커맨드 등록 완료");
    }
    catch (error) {
        console.error("슬래시 커맨드 등록 실패:", error);
    }
})();
