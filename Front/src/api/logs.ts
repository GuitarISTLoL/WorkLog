import { ensureOk } from '../utils/apiError'
import type { CreateLogPayload, GetLogsParams, LogEntry, LogsResponse } from '../types/log'

export async function createLog(payload: CreateLogPayload): Promise<LogEntry> {
  const response = await fetch('/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  await ensureOk(response, 'Не удалось создать запись')
  return response.json() as Promise<LogEntry>
}

export async function fetchLogs(params: GetLogsParams): Promise<LogsResponse> {
  const search = new URLSearchParams({
    count: String(params.count),
    page: String(params.page),
    order: params.order,
  })

  if (params.dateFrom && params.dateTo) {
    search.set('dateFrom', params.dateFrom)
    search.set('dateTo', params.dateTo)
  }

  const response = await fetch(`/log?${search}`)
  await ensureOk(response, 'Не удалось загрузить журнал')
  return response.json() as Promise<LogsResponse>
}

export async function updateLog(
  id: string,
  payload: CreateLogPayload,
): Promise<LogEntry> {
  const response = await fetch(`/log/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  await ensureOk(response, 'Не удалось обновить запись')
  return response.json() as Promise<LogEntry>
}

export async function deleteLog(id: string): Promise<void> {
  const response = await fetch(`/log/${id}`, { method: 'DELETE' })
  await ensureOk(response, 'Не удалось удалить запись')
}
