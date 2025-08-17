import { GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { ENV } from "../config/env";

const WAITING_ROLE_NAME = "대기자";
const WAITING_NOTIFICATION_CHANNEL_ID = ENV.WAITING_NOTIFICATION_CHANNEL_ID;

export default async function onGuildMemberUpdate(
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) {
  const hadWaitingRole =
    oldMember.roles?.cache.some((role) => role.name === WAITING_ROLE_NAME) ??
    false;

  const hasWaitingRole = newMember.roles.cache.some(
    (role) => role.name === WAITING_ROLE_NAME
  );

  if (!hadWaitingRole && hasWaitingRole) {
    const channel = newMember.guild.channels.cache.get(
      WAITING_NOTIFICATION_CHANNEL_ID
    );

    if (!channel || !channel.isTextBased()) {
      console.error(
        "대기자 공지 채널이 존재하지 않거나 텍스트 채널이 아닙니다."
      );
      return;
    }

    try {
      await channel.send(
        `<@${newMember.id}>님, 지난 2주간 블로그 포스팅 미제출로 인해 이번 주 월요일 기준 대기자 역할로 변경되었습니다. 지속적인 스터디 참여를 원하신다면 3일 내 #스터디-복귀-신청 채널에 간단한 사유와 함께 블로그 포스팅 URL을 남겨주세요. 3일 이후에는 모든 스터디 활동에서 제외될 수 있습니다.`
      );
      console.log(`대기자 공지 메시지 전송 완료: ${newMember.user.tag}`);
    } catch (error) {
      console.error("공지 메시지 전송 실패:", error);
    }
  }
}
