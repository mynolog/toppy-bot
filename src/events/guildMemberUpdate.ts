import { GuildMember, PartialGuildMember } from "discord.js";
import { ENV } from "../config/env";

const WAITING_ROLE_NAME = "대기자";
const WAITING_NOTIFICATION_CHANNEL_ID = ENV.WAITING_NOTIFICATION_CHANNEL_ID;
const POSTING_CHANNEL_ID = ENV.POSTING_CHANNEL_ID;

export default async function onGuildMemberUpdate(
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) {
  try {
    // PartialGuildMember이면 전체 멤버 정보 fetch
    if (oldMember.partial) {
      oldMember = await oldMember.fetch();
    }

    // 역할 변화 체크
    const hadWaitingRole = oldMember.roles.cache.some(
      (role) => role.name === WAITING_ROLE_NAME
    );

    const hasWaitingRole = newMember.roles.cache.some(
      (role) => role.name === WAITING_ROLE_NAME
    );

    // 새로 대기자 역할이 추가된 경우에만 메시지 전송
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

      await channel.send(
        `<@${newMember.id}>님, 지난 1주간 블로그 포스팅 미제출로 인해 이번 주 월요일 기준 ${WAITING_ROLE_NAME} 역할로 변경되었습니다. 계속 참여를 원하신다면 이번주 화요일 23:59 까지 <#${POSTING_CHANNEL_ID}> 채널에 블로그 포스팅 URL을 남겨주세요. 기한 내 응답이 없을 경우 즉시 스터디에서 제외됩니다.`
      );

      console.log(`대기자 공지 메시지 전송 완료: ${newMember.user.tag}`);
    }
  } catch (error) {
    console.error("GuildMemberUpdate 처리 중 오류 발생:", error);
  }
}
