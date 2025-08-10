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
        `<@${newMember.id}>님, 3주 이상 블로그 포스팅 미제출로 인해 대기자 역할로 변경되었습니다. 복귀를 원하시면 #스터디-복귀-신청 채널에 사유를 간단히 남겨주세요. 3일 이내 소명하지 않을 경우 스터디에서 제외될 수 있으니 참고 부탁드립니다.`
      );
      console.log(`대기자 공지 메시지 전송 완료: ${newMember.user.tag}`);
    } catch (error) {
      console.error("공지 메시지 전송 실패:", error);
    }
  }
}
