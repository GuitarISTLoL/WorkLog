import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Поверх другого модального окна (рендер в portal, без вложенности в DOM) */
  stacked?: boolean
}

export function Modal({
  open,
  title,
  onClose,
  children,
  stacked = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (stacked) {
          event.stopImmediatePropagation()
        }
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown, stacked)

    if (!stacked) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown, stacked)
      if (!stacked) {
        document.body.style.overflow = ''
      }
    }
  }, [open, onClose, stacked])

  if (!open) {
    return null
  }

  const titleId = stacked ? 'modal-title-stacked' : 'modal-title'

  const content = (
    <div
      className={`modal${stacked ? ' modal--stacked' : ''}`}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )

  return stacked ? createPortal(content, document.body) : content
}
