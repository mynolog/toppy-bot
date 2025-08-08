import { Client, TextChannel } from "discord.js";
import cron from "node-cron";
import { getThisSundayDateString } from "../lib/utils";
import { ENV } from "../config/env";

interface ReminderConfig {
  cronTime: string;
  channelId: string;
  message: () => string;
}

const reminders: ReminderConfig[] = [
  {
    cronTime: "0 20 * * 6",
    channelId: ENV.POSTING_CHANNEL_ID,
    message: () =>
      `@everyone 이번 주 글쓰기 공유 기한은 ${getThisSundayDateString()} 23:59까지 입니다. 아직 공유하지 않으셨다면 포스팅 제출 잊지 마세요!`,
  },
];

export function startRemiderScheduler(client: Client) {
  for (const { cronTime, channelId, message } of reminders) {
    cron.schedule(
      cronTime,
      async () => {
        try {
          const channel = await client.channels.fetch(channelId);
          if (channel?.isTextBased()) {
            (channel as TextChannel).send({
              content: message(),
              allowedMentions: { parse: ["everyone"] },
            });
          }
        } catch (error) {
          console.error("리마인드 메시지 전송 실패:", error);
        }
      },
      { timezone: "Asia/Seoul" }
    );
  }
}
