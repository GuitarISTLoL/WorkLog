export type WorkTypeUnit = 'м' | 'м2' | 'ед'

export const WORK_TYPE_UNITS: WorkTypeUnit[] = ['м', 'м2', 'ед']

export interface WorkType {
  id: string
  title: string
  unit: string
  createdAt: string
  updatedAt: string
}

export interface CreateWorkTypePayload {
  title: string
  unit: WorkTypeUnit
}
