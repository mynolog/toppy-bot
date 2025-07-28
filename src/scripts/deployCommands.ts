import { REST, Routes } from "discord.js";
import { data as checkInCommand } from "../commands/checkIn";
import { data as submitPostCommand } from "../commands/submitPost";
import { ENV } from "../config/env";

const commands = [checkInCommand.toJSON(), submitPostCommand.toJSON()];

const rest = new REST({ version: "10" }).setToken(ENV.DISCORD_TOKEN);

(async () => {
  try {
    console.log("슬래시 커맨드 등록 시작");

    await rest.put(
      Routes.applicationGuildCommands(
        ENV.DISCORD_CLIENT_ID,
        ENV.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log("슬래시 커맨드 등록 완료");
  } catch (error) {
    console.error("슬래시 커맨드 등록 실패:", error);
  }
})();
