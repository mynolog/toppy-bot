import {
  ActivityType,
  APIInteraction,
  Client,
  GatewayIntentBits,
  InteractionType,
  InteractionResponseType,
  InteractionResponse,
} from "discord.js";
import { verifyKeyMiddleware } from "discord-interactions";
import onGuildMemberAdd from "./events/guildMemberAdd";
import onInteractionCreate from "./events/interactionCreate";
import { ENV } from "./config/env";
import onGuildMemberUpdate from "./events/guildMemberUpdate";
import express, { type Request, type Response } from "express";

type DiscordInteractionResponse = {
  type: number;
  data?: {
    content?: string;
    embeds?: any[];
    components?: any[];
  };
  flags?: number;
};

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("인턴 토피가 작동 중입니다!"));
app.post(
  "/interactions",
  verifyKeyMiddleware(ENV.DISCORD_PUBLIC_KEY),
  (
    req: Request<{}, {}, APIInteraction>,
    res: Response<DiscordInteractionResponse>
  ) => {
    const interaction = req.body;

    if (interaction.type === InteractionType.ApplicationCommand) {
      return res.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: "🤖 인턴 토피가 깨어나는 중… 잠시만 기다려 주세요!" },
        flags: 1 << 6,
      });
    }
  }
);
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

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
