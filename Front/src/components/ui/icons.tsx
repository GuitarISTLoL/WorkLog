interface IconProps {
  size?: number
}

export function IconEdit({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

export function IconTrash({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14H5V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export function IconSort({ direction }: { direction: 'ASC' | 'DESC' | null }) {
  return (
    <span className="icon-sort" aria-hidden="true">
      <svg
        className={`icon-sort__up${direction === 'ASC' ? ' icon-sort__active' : ''}`}
        width="10"
        height="6"
        viewBox="0 0 10 6"
      >
        <path d="M5 0 10 6H0Z" fill="currentColor" />
      </svg>
      <svg
        className={`icon-sort__down${direction === 'DESC' ? ' icon-sort__active' : ''}`}
        width="10"
        height="6"
        viewBox="0 0 10 6"
      >
        <path d="M5 6 0 0h10Z" fill="currentColor" />
      </svg>
    </span>
  )
}
