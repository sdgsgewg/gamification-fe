import dayjs from "dayjs";

/**
 * Output: `1 Month 2 Weeks 3 Day 1 Hour 40 Minutes`
 */
export function getDuration(
  startTime: Date | null,
  endTime: Date | null
): string {
  if (!startTime || !endTime) return "";

  const diffMs = endTime.getTime() - startTime.getTime();
  if (diffMs <= 0) return "0 Menit";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  const months = Math.floor(diffMinutes / (60 * 24 * 30)); // asumsi 30 hari per bulan
  const weeks = Math.floor((diffMinutes % (60 * 24 * 30)) / (60 * 24 * 7));
  const days = Math.floor((diffMinutes % (60 * 24 * 7)) / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} ${months > 1 ? `Months` : `Month`}`);
  if (weeks > 0) parts.push(`${weeks} ${weeks > 1 ? `Weeks` : `Week`}`);
  if (days > 0) parts.push(`${days} ${days > 1 ? `Days` : `Day`}`);
  if (hours > 0) parts.push(`${hours} ${hours > 1 ? `Hours` : `Hour`}`);
  if (minutes > 0)
    parts.push(`${minutes} ${minutes > 1 ? `Minutes` : `Minute`}`);

  return parts.join(" ");
}

/**
 * Output: `Nov 3, 2025`
 */
export function getDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDateTime(date: Date | string | null): string {
  if (!date) return "";

  // Kalau input string, parse jadi Date
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return ""; // handle invalid date

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const day = d.getDate();
  const month = monthsShort[d.getMonth()];
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, "0");
  const minute = d.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} (${hour}:${minute})`;
}

export function combineDateTime(date: Date, time: Date) {
  const d = dayjs(date);
  const t = dayjs(time);
  return dayjs(`${d.format("YYYY-MM-DD")} ${t.format("HH:mm")}`).toDate();
}

export function parseDate(value?: Date | string | null): Date | undefined {
  return value ? new Date(value) : undefined;
}
