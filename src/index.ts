import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import onGuildMemberAdd from "./events/guildMemberAdd";
import onInteractionCreate from "./events/interactionCreate";
import { ENV } from "./config/env";
import onGuildMemberUpdate from "./events/guildMemberUpdate";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);

  client.user?.setPresence({
    activities: [
      {
        name: "보고만 있을게요... (아마도) 💬",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });

  try {
    const channel = await client.channels.fetch(ENV.TOPPY_TALK_CHANNEL_ID);
    if (channel?.isSendable()) {
      await channel.send(
        "🤖 인턴 토피가 깨어났습니다! 이전 명령어가 응답하지 않았다면 다시 시도해주세요."
      );
    }
  } catch (err) {
    console.error("Ready 이벤트 안내 메시지 전송 실패", err);
  }
});

client.on("guildMemberAdd", onGuildMemberAdd);
client.on("interactionCreate", onInteractionCreate);
client.on("guildMemberUpdate", onGuildMemberUpdate);

client.login(ENV.DISCORD_TOKEN);
