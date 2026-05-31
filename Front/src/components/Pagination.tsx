import './Pagination.css'

export const PAGE_SIZE_OPTIONS = [10, 20, 30] as const

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

interface PaginationProps {
  page: number
  pageSize: PageSize
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function Ellipsis() {
  return <span className="pagination__ellipsis">…</span>
}

function buildPageItems(
  current: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const items: Array<number | 'ellipsis'> = [1]

  if (current > 3) {
    items.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)

  for (let p = start; p <= end; p += 1) {
    items.push(p)
  }

  if (current < totalPages - 2) {
    items.push('ellipsis')
  }

  items.push(totalPages)
  return items
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (total === 0) {
    return null
  }

  const pageItems = buildPageItems(page, totalPages)

  return (
    <div className="pagination-bar">
      <label className="pagination-bar__size">
        <span className="pagination-bar__size-label">На странице</span>
        <select
          className="pagination-bar__size-select"
          value={pageSize}
          aria-label="Количество записей на странице"
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value) as PageSize)
          }
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <nav className="pagination" aria-label="Пагинация">
      <button
        type="button"
        className="pagination__control"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft />
      </button>

      {pageItems.map((item, index) =>
        item === 'ellipsis' ? (
          <Ellipsis key={`ellipsis-${index}`} />
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination__page${item === page ? ' pagination__page--active' : ''}`}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className="pagination__control"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Следующая страница"
      >
        <ChevronRight />
      </button>
      </nav>
    </div>
  )
}
