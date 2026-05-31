import { WorkLogTableRow } from './WorkLogTableRow'
import { WorkLogTableDayDivider } from './WorkLogTableDayDivider'
import type { LogEntry } from '../types/log'
import type { GetLogsParams } from '../types/log'
import { groupLogsByDay } from '../utils/groupLogsByDay'
import { IconSort } from './ui/icons'
import './WorkLogTable.css'

const DATA_HEADERS = [
  { key: 'user', label: 'ФИО сотрудника', sortable: false },
  { key: 'title', label: 'Наименование работы', sortable: false },
  { key: 'unit', label: 'Единица изм.', sortable: false },
  { key: 'count', label: 'Объём', sortable: false },
  { key: 'date', label: 'Дата', sortable: true },
] as const

interface WorkLogTableProps {
  rows: LogEntry[]
  order: GetLogsParams['order']
  onOrderChange: (order: GetLogsParams['order']) => void
  onEdit: (row: LogEntry) => void
  onMutated: () => void
}

export function WorkLogTable({
  rows,
  order,
  onOrderChange,
  onEdit,
  onMutated,
}: WorkLogTableProps) {
  if (rows.length === 0) {
    return <div className="work-log-table-empty">Нет записей</div>
  }

  const handleDateSort = () => {
    onOrderChange(order === 'DESC' ? 'ASC' : 'DESC')
  }

  const groupedItems = groupLogsByDay(rows)

  return (
    <table className="work-log-table">
      <thead>
        <tr>
          {DATA_HEADERS.map((header) => (
            <th key={header.key}>
              {header.sortable ? (
                <button
                  type="button"
                  className="work-log-table__sort-btn"
                  onClick={handleDateSort}
                  aria-label={`Сортировка по дате: ${
                    order === 'DESC' ? 'сначала новые' : 'сначала старые'
                  }`}
                >
                  {header.label}
                  <IconSort direction={order} />
                </button>
              ) : (
                header.label
              )}
            </th>
          ))}
          <th className="work-log-table__actions-head" aria-label="Действия" />
        </tr>
      </thead>
      <tbody>
        {groupedItems.map((item) =>
          item.kind === 'day' ? (
            <WorkLogTableDayDivider key={`day-${item.dayKey}`} label={item.label} />
          ) : (
            <WorkLogTableRow
              key={item.row.id}
              row={item.row}
              onEdit={onEdit}
              onMutated={onMutated}
            />
          ),
        )}
      </tbody>
    </table>
  )
}
