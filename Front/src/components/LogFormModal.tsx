import { useEffect, useState, type FormEvent } from 'react'
import { createLog, updateLog } from '../api/logs'
import type { LogEntry } from '../types/log'
import type { WorkType } from '../types/workType'
import { isApiError, type FieldErrors } from '../utils/apiError'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { WorkTypeSelect } from './WorkTypeSelect'
import './ui/form.css'
import {
  TEXT_WITH_PUNCTUATION,
  TEXT_WITH_PUNCTUATION_MESSAGE,
} from '../utils/textValidation'
import './AddLogModal.css'

interface LogFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  log?: LogEntry | null
  onClose: () => void
  onSuccess: () => void
}

export function LogFormModal({
  open,
  mode,
  log,
  onClose,
  onSuccess,
}: LogFormModalProps) {
  const [user, setUser] = useState('')
  const [workType, setWorkType] = useState<WorkType | null>(null)
  const [count, setCount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isEdit = mode === 'edit'
  const unit = workType?.unit ?? ''

  useEffect(() => {
    if (!open) {
      return
    }

    if (isEdit && log) {
      setUser(log.user)
      setWorkType(log.type ?? null)
      setCount(String(log.count))
    } else if (!isEdit) {
      setUser('')
      setWorkType(null)
      setCount('')
    }
    setFormError(null)
    setFieldErrors({})
  }, [open, isEdit, log])

  const resetForm = () => {
    setUser('')
    setWorkType(null)
    setCount('')
    setFormError(null)
    setFieldErrors({})
  }

  const handleClose = () => {
    if (submitting) {
      return
    }
    resetForm()
    onClose()
  }

  const validate = (): boolean => {
    const next: FieldErrors = {}
    const trimmedUser = user.trim()

    if (trimmedUser.length < 5) {
      next.user = 'ФИО должно содержать не менее 5 символов'
    } else if (!TEXT_WITH_PUNCTUATION.test(trimmedUser)) {
      next.user = `ФИО: ${TEXT_WITH_PUNCTUATION_MESSAGE}`
    }

    if (!workType) {
      next.type = 'Выберите наименование работы'
    }

    const volume = Number(count)
    if (!Number.isFinite(volume) || volume <= 0) {
      next.count = 'Укажите положительный объём'
    }

    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setFieldErrors({})

    if (!validate()) {
      return
    }

    const trimmedUser = user.trim()
    const volume = Number(count)

    setSubmitting(true)
    try {
      const payload = {
        user: trimmedUser,
        type: workType!.id,
        count: volume,
      }

      if (isEdit && log) {
        await updateLog(log.id, payload)
      } else {
        await createLog(payload)
      }

      resetForm()
      onSuccess()
      onClose()
    } catch (e) {
      if (isApiError(e)) {
        setFieldErrors(e.fieldErrors)
        setFormError(
          Object.keys(e.fieldErrors).length === 0 ? e.message : null,
        )
      } else {
        setFormError(
          e instanceof Error
            ? e.message
            : isEdit
              ? 'Не удалось обновить запись'
              : 'Не удалось сохранить запись',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Изменить запись' : 'Добавить запись'}
      onClose={handleClose}
    >
      <form className="add-log-form" onSubmit={handleSubmit}>
        {formError && (
          <p className="form-message form-message--error">{formError}</p>
        )}

        <div className="form-field">
          <label className="form-field__label" htmlFor="log-user">
            ФИО
          </label>
          <input
            id="log-user"
            className="form-field__input"
            type="text"
            value={user}
            autoComplete="name"
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.user)}
            onChange={(event) => {
              setUser(event.target.value)
              setFieldErrors((prev) => ({ ...prev, user: undefined }))
            }}
          />
          {fieldErrors.user && (
            <p className="form-field__error">{fieldErrors.user}</p>
          )}
        </div>

        <div className="form-field">
          <span className="form-field__label">Наименование работы</span>
          <WorkTypeSelect
            value={workType}
            disabled={submitting}
            error={fieldErrors.type}
            onChange={(next) => {
              setWorkType(next)
              setFieldErrors((prev) => ({ ...prev, type: undefined }))
            }}
          />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="log-unit">
            Единица измерения
          </label>
          <input
            id="log-unit"
            className="form-field__input"
            type="text"
            value={unit}
            readOnly
            placeholder="Выберите вид работы"
            tabIndex={-1}
          />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="log-count">
            Объём
          </label>
          <input
            id="log-count"
            className="form-field__input"
            type="number"
            min="0"
            step="any"
            value={count}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.count)}
            onChange={(event) => {
              setCount(event.target.value)
              setFieldErrors((prev) => ({ ...prev, count: undefined }))
            }}
          />
          {fieldErrors.count && (
            <p className="form-field__error">{fieldErrors.count}</p>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={handleClose}
          >
            Отмена
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Сохранение…' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
