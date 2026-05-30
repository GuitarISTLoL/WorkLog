import { useEffect, useState } from 'react'
import { createWorkType, updateWorkType } from '../api/workTypes'
import {
  WORK_TYPE_UNITS,
  type CreateWorkTypePayload,
  type WorkType,
  type WorkTypeUnit,
} from '../types/workType'
import { isApiError, type FieldErrors } from '../utils/apiError'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import './ui/form.css'
import {
  TEXT_WITH_PUNCTUATION,
  TEXT_WITH_PUNCTUATION_MESSAGE,
} from '../utils/textValidation'
import './CreateWorkTypeModal.css'

function toPickerUnit(unit: string): WorkTypeUnit {
  if (WORK_TYPE_UNITS.includes(unit as WorkTypeUnit)) {
    return unit as WorkTypeUnit
  }
  return 'м'
}

interface WorkTypeFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  workType?: WorkType | null
  onClose: () => void
  onCreated?: (workType: WorkType) => void
  onUpdated?: (workType: WorkType) => void
}

export function WorkTypeFormModal({
  open,
  mode,
  workType,
  onClose,
  onCreated,
  onUpdated,
}: WorkTypeFormModalProps) {
  const [title, setTitle] = useState('')
  const [unit, setUnit] = useState<WorkTypeUnit>('м')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isEdit = mode === 'edit'

  useEffect(() => {
    if (!open) {
      return
    }

    if (isEdit && workType) {
      setTitle(workType.title)
      setUnit(toPickerUnit(workType.unit))
    } else if (!isEdit) {
      setTitle('')
      setUnit('м')
    }
    setFormError(null)
    setFieldErrors({})
  }, [open, isEdit, workType])

  const resetForm = () => {
    setTitle('')
    setUnit('м')
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

  const validate = (): CreateWorkTypePayload | null => {
    const trimmedTitle = title.trim()
    const next: FieldErrors = {}

    if (!trimmedTitle) {
      next.title = 'Укажите наименование работы'
    } else if (!TEXT_WITH_PUNCTUATION.test(trimmedTitle)) {
      next.title = `Наименование работы: ${TEXT_WITH_PUNCTUATION_MESSAGE}`
    }

    setFieldErrors(next)
    if (Object.keys(next).length > 0) {
      return null
    }

    return { title: trimmedTitle, unit }
  }

  const handleSubmit = async () => {
    setFormError(null)
    setFieldErrors({})

    const payload = validate()
    if (!payload) {
      return
    }

    setSubmitting(true)
    try {
      if (isEdit && workType) {
        const updated = await updateWorkType(workType.id, payload)
        onUpdated?.(updated)
      } else {
        const created = await createWorkType(payload)
        onCreated?.(created)
      }
      resetForm()
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
              ? 'Не удалось обновить вид работ'
              : 'Не удалось создать вид работ',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      stacked
      title={isEdit ? 'Изменить вид работы' : 'Новый вид работы'}
      onClose={handleClose}
    >
      <div className="create-work-type-form">
        {formError && (
          <p className="form-message form-message--error">{formError}</p>
        )}

        <div className="form-field">
          <label className="form-field__label" htmlFor="work-type-title">
            Наименование работы
          </label>
          <input
            id="work-type-title"
            className="form-field__input"
            type="text"
            value={title}
            disabled={submitting}
            autoFocus
            aria-invalid={Boolean(fieldErrors.title)}
            onChange={(event) => {
              setTitle(event.target.value)
              setFieldErrors((prev) => ({ ...prev, title: undefined }))
            }}
          />
          {fieldErrors.title && (
            <p className="form-field__error">{fieldErrors.title}</p>
          )}
        </div>

        <div className="form-field">
          <span className="form-field__label" id="work-type-unit-label">
            Единица измерения
          </span>
          <div
            className="unit-picker"
            role="radiogroup"
            aria-labelledby="work-type-unit-label"
          >
            {WORK_TYPE_UNITS.map((option) => (
              <label key={option} className="unit-picker__option">
                <input
                  type="radio"
                  name="work-type-unit"
                  value={option}
                  checked={unit === option}
                  disabled={submitting}
                  onChange={() => setUnit(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
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
          <Button
            type="button"
            variant="primary"
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
