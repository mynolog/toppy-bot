import { Client, TextChannel } from "discord.js";
import cron from "node-cron";
import { getThisSundayDateString } from "../lib/utils";
import { ENV } from "../config/env";

interface ReminderConfig {
  cronTime: string;
  channelId: string;
  message: string;
}

const reminders: ReminderConfig[] = [
  {
    cronTime: "0 17 * * 6",
    channelId: ENV.POSTING_CHANNEL_ID,
    message: `@everyone 이번 주 글쓰기 제출 기한은 ${getThisSundayDateString()} 23:59까지 입니다. 아직 제출하지 않으셨다면 포스팅 제출 잊지 마세요!`,
  },
  {
    cronTime: "0 20 * * 3",
    channelId: ENV.VACATION_CHANNEL_ID,
    message: `@everyone 이번 주 휴가 신청은 마감되었습니다. 이후 신청은 반영되지 않습니다.`,
  },
];

export function startRemiderScheduler(client: Client) {
  for (const { cronTime, channelId, message } of reminders) {
    cron.schedule(cronTime, async () => {
      try {
        const channel = await client.channels.fetch(channelId);
        if (channel?.isTextBased()) {
          (channel as TextChannel).send({
            content: message,
            allowedMentions: { parse: ["everyone"] },
          });
        }
      } catch (error) {
        console.error("리마인드 메시지 전송 실패:", error);
      }
    });
  }
}
