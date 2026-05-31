import type { LogEntry } from "../types/log";
import { isoToDateInputValue } from "./dateInput";

export type GroupedLogItem =
  | { kind: "day"; dayKey: string; label: string }
  | { kind: "row"; row: LogEntry };

function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  const formatted = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const weekday = date.toLocaleDateString("ru-RU", { weekday: "long" });
  const weekdayCap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${formatted} · ${weekdayCap}`;
}

export function groupLogsByDay(rows: LogEntry[]): GroupedLogItem[] {
  const items: GroupedLogItem[] = [];
  let lastDayKey: string | null = null;

  for (const row of rows) {
    const dayKey = isoToDateInputValue(row.complitedAt);
    if (dayKey !== lastDayKey) {
      items.push({
        kind: "day",
        dayKey,
        label: formatDayLabel(row.complitedAt),
      });
      lastDayKey = dayKey;
    }
    items.push({ kind: "row", row });
  }

  return items;
}
