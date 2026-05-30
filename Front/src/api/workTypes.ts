import { ensureOk } from '../utils/apiError'
import type { CreateWorkTypePayload, WorkType } from '../types/workType'

export async function createWorkType(
  payload: CreateWorkTypePayload,
): Promise<WorkType> {
  const response = await fetch('/work-type', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  await ensureOk(response, 'Не удалось создать вид работ')
  return response.json() as Promise<WorkType>
}

export async function fetchWorkTypes(): Promise<WorkType[]> {
  const response = await fetch('/work-type')
  await ensureOk(response, 'Не удалось загрузить виды работ')
  return response.json() as Promise<WorkType[]>
}

export async function searchWorkTypes(title: string): Promise<WorkType[]> {
  const search = new URLSearchParams({ title })
  const response = await fetch(`/work-type/search?${search}`)

  await ensureOk(response, 'Не удалось найти виды работ')
  return response.json() as Promise<WorkType[]>
}

export async function updateWorkType(
  id: string,
  payload: CreateWorkTypePayload,
): Promise<WorkType> {
  const response = await fetch(`/work-type/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  await ensureOk(response, 'Не удалось обновить вид работ')
  return response.json() as Promise<WorkType>
}

export async function deleteWorkType(id: string): Promise<void> {
  const response = await fetch(`/work-type/${id}`, { method: 'DELETE' })
  await ensureOk(response, 'Не удалось удалить вид работ')
}
