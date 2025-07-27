import dotenv from "dotenv";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { sheets, SPREADSHEET_ID } from "../services/googleSheets";

dotenv.config({ path: ".env.local" });

// 출석 명령어 등록
export const data = new SlashCommandBuilder()
  .setName("출석")
  .setDescription("오늘 출석 기록하기");

export async function execute(interaction: ChatInputCommandInteraction) {
  // 출석 채널 ID 검사
  const allowedChannelId = process.env.CHECKIN_CHANNEL_ID!;
  if (interaction.channelId !== allowedChannelId) {
    return interaction.reply({
      content: "❌ 해당 명령어는 출석체크 채널에서만 사용할 수 있습니다.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const user = interaction.user; // user 객체
  const username = user.username; // Discord username

  // 오늘 날짜 포맷 처리
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const dateText = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  try {
    // 현재 시트 가져오기
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "출석부!A1:Z1000",
    });

    const data = res.data.values || [];

    // 행 - username 목록
    const usernameRow = data[0] || [];
    const usernames = usernameRow.slice(1);

    // 열 - 날짜 목록
    const dateCol = data.map((row) => row[0]);
    const dates = dateCol.slice(1);

    let colIndexInUsernames = usernames.indexOf(username);
    if (colIndexInUsernames === -1) {
      // 새로운 user일 경우 username 추가
      usernames.push(username);
      colIndexInUsernames = usernames.length - 1;
      const updatedUsernameRow = [
        usernameRow[0] || "날짜/닉네임",
        ...usernames,
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: "출석부!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [updatedUsernameRow] },
      });
    }

    let rowIndexInDates = dates.indexOf(date);
    if (rowIndexInDates === -1) {
      // 오늘 날짜가 없으면 새 행 추가
      rowIndexInDates = dates.length;

      const newRow = Array(usernames.length + 1).fill("");
      newRow[0] = date;

      const sheetRowNumber = rowIndexInDates + 2;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `출석부!A${sheetRowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [newRow] },
      });
    }

    const realRowIndex = rowIndexInDates + 1;
    const realColIndex = colIndexInUsernames + 1;

    // 출석 여부 확인
    const existingValue =
      data[realRowIndex] && data[realRowIndex][realColIndex]
        ? data[realRowIndex][realColIndex]
        : "";

    // 이미 출석한 경우
    if (existingValue === "O") {
      return interaction.reply({
        content: `${user}님, 오늘 이미 출석체크했습니다.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // 셀 주소 계산
    const colLetter = String.fromCharCode(65 + realColIndex);
    const cell = `${colLetter}${realRowIndex + 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `출석부!${cell}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [["O"]] },
    });

    await interaction.reply({
      content: `${user}님, ${dateText} 출석 완료!`,
      allowedMentions: { users: [interaction.user.id] },
    });
  } catch (error) {
    console.error("출석 처리 오류:", error);
    return interaction.reply({
      content: "출석 처리 중 문제가 발생했습니다.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
