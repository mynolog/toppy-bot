export function getThisSundayDateString() {
  const today = new Date();
  const day = today.getDay();
  const diff = 7 - day;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + diff);

  const dateText = sunday.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return dateText;
}
