import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import './LogDateFilter.css'
import './ui/form.css'

export interface DateFilterValue {
  dateFrom: string
  dateTo: string
}

interface LogDateFilterProps {
  value: DateFilterValue
  onApply: (value: DateFilterValue) => void
  onClear: () => void
}

export function LogDateFilter({ value, onApply, onClear }: LogDateFilterProps) {
  const [draftFrom, setDraftFrom] = useState(value.dateFrom)
  const [draftTo, setDraftTo] = useState(value.dateTo)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraftFrom(value.dateFrom)
    setDraftTo(value.dateTo)
  }, [value.dateFrom, value.dateTo])

  const hasActiveFilter = Boolean(value.dateFrom && value.dateTo)

  const handleApply = () => {
    if (!draftFrom || !draftTo) {
      setError('Укажите обе даты')
      return
    }

    if (draftFrom > draftTo) {
      setError('Дата «с» не может быть позже даты «по»')
      return
    }

    setError(null)
    onApply({ dateFrom: draftFrom, dateTo: draftTo })
  }

  const handleClear = () => {
    setDraftFrom('')
    setDraftTo('')
    setError(null)
    onClear()
  }

  return (
    <div className="log-date-filter">
      <div className="log-date-filter__controls">
        <label className="log-date-filter__field">
          <span className="log-date-filter__label">С</span>
          <input
            type="date"
            className="form-field__input log-date-filter__input"
            value={draftFrom}
            onChange={(event) => {
              setDraftFrom(event.target.value)
              setError(null)
            }}
          />
        </label>
        <label className="log-date-filter__field">
          <span className="log-date-filter__label">По</span>
          <input
            type="date"
            className="form-field__input log-date-filter__input"
            value={draftTo}
            onChange={(event) => {
              setDraftTo(event.target.value)
              setError(null)
            }}
          />
        </label>
        <Button type="button" variant="secondary" onClick={handleApply}>
          Найти
        </Button>
        {hasActiveFilter && (
          <Button type="button" variant="secondary" onClick={handleClear}>
            Сбросить
          </Button>
        )}
      </div>
      {error && (
        <p className="log-date-filter__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
