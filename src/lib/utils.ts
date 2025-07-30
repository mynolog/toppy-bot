export function getThisSundayDateString() {
  const now = new Date();
  // KST 보정 (UTC+9)
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);

  const day = kstDate.getDay();
  const diff = 7 - day;
  const sunday = new Date(kstDate);
  sunday.setDate(kstDate.getDate() + diff);

  const dateText = sunday.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return dateText;
}

export function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[today.getDay()];

  return `${year}년 ${month}월 ${date}일 (${weekday})`;
}
