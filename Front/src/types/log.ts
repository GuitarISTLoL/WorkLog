export interface WorkType {
  id: string
  title: string
  unit: string
  createdAt: string
  updatedAt: string
}

export interface LogEntry {
  id: string
  user: string
  type: WorkType
  count: number
  createdAt: string
  updatedAt: string
}

export type LogsResponse = [LogEntry[], number]

export interface GetLogsParams {
  count: number
  page: number
  order: 'ASC' | 'DESC'
  dateFrom?: string
  dateTo?: string
}

export interface CreateLogPayload {
  user: string
  type: string
  count: number
}
