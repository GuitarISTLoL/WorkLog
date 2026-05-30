import './WorkLogTableDayDivider.css'

interface WorkLogTableDayDividerProps {
  label: string
}

export function WorkLogTableDayDivider({ label }: WorkLogTableDayDividerProps) {
  return (
    <tr className="work-log-table-day">
      <td colSpan={6}>
        <div className="work-log-table-day__label">{label}</div>
      </td>
    </tr>
  )
}
