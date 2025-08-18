import { GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { ENV } from "../config/env";

const WAITING_ROLE_NAME = "대기자";
const WAITING_NOTIFICATION_CHANNEL_ID = ENV.WAITING_NOTIFICATION_CHANNEL_ID;
const STUDY_REJOIN_CHANNEL_ID = ENV.STUDY_REJOIN_CHANNEL_ID;

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
        `<@${newMember.id}>님, 지난 1주간 블로그 포스팅 미제출로 인해 이번 주 월요일 기준 ${WAITING_ROLE_NAME} 역할로 변경되었습니다. 계속 참여를 원하신다면 하루 이내에 <#${STUDY_REJOIN_CHANNEL_ID}> 채널에 블로그 포스팅 URL을 남겨주세요. 기한 내 응답이 없을 경우 즉시 스터디에서 제외됩니다.`
      );
      console.log(`대기자 공지 메시지 전송 완료: ${newMember.user.tag}`);
    } catch (error) {
      console.error("공지 메시지 전송 실패:", error);
    }
  }
}
