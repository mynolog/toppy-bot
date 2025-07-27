import { GuildMember } from "discord.js";

export default async function onGuildMemberAdd(member: GuildMember) {
  const role = member.guild.roles.cache.find((r) => r.name === "편집자");
  if (role) {
    try {
      await member.roles.add(role);
      console.log(`🎉 ${member.user.tag}님에게 '편집자' 역할 부여됨`);
    } catch (error) {
      console.error("❌ 역할 부여 실패:", error);
    }
  } else {
    console.warn("⚠️ '편집자' 역할을 찾을 수 없습니다");
  }
}
