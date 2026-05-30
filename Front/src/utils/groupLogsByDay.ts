import type { LogEntry } from '../types/log'

export type GroupedLogItem =
  | { kind: 'day'; dayKey: string; label: string }
  | { kind: 'row'; row: LogEntry }

function getDayKey(iso: string): string {
  const date = new Date(iso)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDayLabel(iso: string): string {
  const date = new Date(iso)
  const formatted = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'long' })
  const weekdayCap = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return `${formatted} · ${weekdayCap}`
}

export function groupLogsByDay(rows: LogEntry[]): GroupedLogItem[] {
  const items: GroupedLogItem[] = []
  let lastDayKey: string | null = null

  for (const row of rows) {
    const dayKey = getDayKey(row.createdAt)
    if (dayKey !== lastDayKey) {
      items.push({
        kind: 'day',
        dayKey,
        label: formatDayLabel(row.createdAt),
      })
      lastDayKey = dayKey
    }
    items.push({ kind: 'row', row })
  }

  return items
}
