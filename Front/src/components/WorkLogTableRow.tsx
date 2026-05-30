import { useState } from 'react'
import { deleteLog } from '../api/logs'
import type { LogEntry } from '../types/log'
import { IconButton } from './ui/IconButton'
import { IconEdit, IconTrash } from './ui/icons'
import './WorkLogTableRow.css'

interface WorkLogTableRowProps {
  row: LogEntry
  onEdit: (row: LogEntry) => void
  onMutated: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function WorkLogTableRow({ row, onEdit, onMutated }: WorkLogTableRowProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Удалить эту запись?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteLog(row.id)
      onMutated()
    } catch {
      window.alert('Не удалось удалить запись')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <tr className="work-log-table-row">
      <td>{row.user}</td>
      <td>{row.type?.title ?? '—'}</td>
      <td>{row.type?.unit ?? '—'}</td>
      <td>{row.count}</td>
      <td>{formatDate(row.createdAt)}</td>
      <td>
        <div className="work-log-table-row__actions">
          <IconButton
            label="Изменить запись"
            disabled={deleting}
            onClick={() => onEdit(row)}
          >
            <IconEdit />
          </IconButton>
          <IconButton
            label="Удалить запись"
            variant="danger"
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            <IconTrash />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
