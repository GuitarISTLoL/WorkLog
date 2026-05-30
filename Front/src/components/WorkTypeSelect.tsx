import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { fetchWorkTypes, searchWorkTypes } from '../api/workTypes'
import type { WorkType } from '../types/workType'
import { WorkTypeFormModal } from './WorkTypeFormModal'
import { Button } from './ui/Button'
import { IconButton } from './ui/IconButton'
import { IconEdit } from './ui/icons'
import './ui/form.css'
import './WorkTypeSelect.css'

const SEARCH_DEBOUNCE_MS = 300

interface WorkTypeSelectProps {
  value: WorkType | null
  onChange: (workType: WorkType | null) => void
  disabled?: boolean
  error?: string
}

export function WorkTypeSelect({
  value,
  onChange,
  disabled = false,
  error,
}: WorkTypeSelectProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState<WorkType[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WorkType | null>(null)

  const modalOpen = createOpen || editOpen

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false
    const timer = window.setTimeout(() => {
      const load = async () => {
        setLoading(true)
        setLoadError(null)
        try {
          const items = search.trim()
            ? await searchWorkTypes(search.trim())
            : await fetchWorkTypes()
          if (!cancelled) {
            setOptions(items)
          }
        } catch (e) {
          if (!cancelled) {
            setLoadError(
              e instanceof Error ? e.message : 'Ошибка загрузки списка',
            )
            setOptions([])
          }
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      }

      void load()
    }, search.trim() ? SEARCH_DEBOUNCE_MS : 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [open, search])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (modalOpen) {
        return
      }
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [modalOpen])

  const handleSelect = (item: WorkType) => {
    onChange(item)
    setOpen(false)
    setSearch('')
  }

  const handleCreated = (item: WorkType) => {
    onChange(item)
    setOptions((prev) => [item, ...prev.filter((o) => o.id !== item.id)])
    setCreateOpen(false)
    setOpen(false)
    setSearch('')
  }

  const handleUpdated = (item: WorkType) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === item.id ? item : o)),
    )
    if (value?.id === item.id) {
      onChange(item)
    }
    setEditOpen(false)
    setEditingItem(null)
  }

  const openEdit = (item: WorkType, event: ReactMouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setEditingItem(item)
    setEditOpen(true)
  }

  return (
    <div className="work-type-select-field">
    <div
      ref={rootRef}
      className={`work-type-select${open ? ' work-type-select--open' : ''}`}
    >
      <button
        type="button"
        className="work-type-select__trigger form-field__input"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={
            value ? 'work-type-select__value' : 'work-type-select__placeholder'
          }
        >
          {value ? value.title : 'Выберите вид работы'}
        </span>
        <span className="work-type-select__chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="work-type-select__dropdown">
          <Button
            type="button"
            variant="secondary"
            className="work-type-select__create"
            disabled={disabled}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => setCreateOpen(true)}
          >
            Создать новую
          </Button>
          <input
            type="search"
            className="work-type-select__search form-field__input"
            placeholder="Поиск…"
            value={search}
            autoFocus
            onChange={(event) => setSearch(event.target.value)}
          />
          <ul
            id={listId}
            className="work-type-select__list"
            role="listbox"
            aria-label="Виды работ"
          >
            {loading && (
              <li className="work-type-select__hint">Загрузка…</li>
            )}
            {loadError && (
              <li className="work-type-select__hint work-type-select__hint--error">
                {loadError}
              </li>
            )}
            {!loading && !loadError && options.length === 0 && (
              <li className="work-type-select__hint">Ничего не найдено</li>
            )}
            {!loading &&
              !loadError &&
              options.map((item) => (
                <li
                  key={item.id}
                  className="work-type-select__row"
                  role="option"
                  aria-selected={value?.id === item.id}
                >
                  <button
                    type="button"
                    className="work-type-select__option"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="work-type-select__option-title">
                      {item.title}
                    </span>
                    <span className="work-type-select__unit">{item.unit}</span>
                  </button>
                  <IconButton
                    label="Изменить вид работы"
                    className="work-type-select__edit"
                    disabled={disabled}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => openEdit(item, event)}
                  >
                    <IconEdit />
                  </IconButton>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>

      {error && <p className="form-field__error">{error}</p>}

      <WorkTypeFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <WorkTypeFormModal
        open={editOpen}
        mode="edit"
        workType={editingItem}
        onClose={() => {
          setEditOpen(false)
          setEditingItem(null)
        }}
        onUpdated={handleUpdated}
      />
    </div>
  )
}
