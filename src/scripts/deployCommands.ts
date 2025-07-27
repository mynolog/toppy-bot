import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { data as checkInCommand } from "../commands/checkIn";

dotenv.config({ path: ".env.local" });

const commands = [checkInCommand.toJSON()];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("슬래시 커맨드 등록 시작");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID!,
        process.env.DISCORD_GUILD_ID!
      ),
      { body: commands }
    );

    console.log("슬래시 커맨드 등록 완료");
  } catch (error) {
    console.error("슬래시 커맨드 등록 실패:", error);
  }
})();
