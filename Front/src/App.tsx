import { useCallback, useEffect, useState } from 'react'
import { fetchLogs } from './api/logs'
import { LogDateFilter, type DateFilterValue } from './components/LogDateFilter'
import { LogFormModal } from './components/LogFormModal'
import { Pagination, type PageSize } from './components/Pagination'
import { WorkLogTable } from './components/WorkLogTable'
import { Button } from './components/ui/Button'
import type { GetLogsParams, LogEntry } from './types/log'
import './App.css'

const DEFAULT_PAGE_SIZE: PageSize = 10

const EMPTY_DATE_FILTER: DateFilterValue = { dateFrom: '', dateTo: '' }

function App() {
  const [rows, setRows] = useState<LogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(DEFAULT_PAGE_SIZE)
  const [order, setOrder] = useState<GetLogsParams['order']>('DESC')
  const [dateFilter, setDateFilter] =
    useState<DateFilterValue>(EMPTY_DATE_FILTER)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [logModalMode, setLogModalMode] = useState<'create' | 'edit'>('create')
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null)

  const loadLogs = useCallback(
    async (
      currentPage: number,
      currentPageSize: PageSize,
      sortOrder: GetLogsParams['order'],
      dates: DateFilterValue,
    ) => {
      setLoading(true)
      setError(null)
      try {
        const params: GetLogsParams = {
          count: currentPageSize,
          page: currentPage,
          order: sortOrder,
        }

        if (dates.dateFrom && dates.dateTo) {
          params.dateFrom = dates.dateFrom
          params.dateTo = dates.dateTo
        }

        const [items, count] = await fetchLogs(params)
        setRows(items)
        setTotal(count)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки')
        setRows([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void loadLogs(page, pageSize, order, dateFilter)
  }, [page, pageSize, order, dateFilter, loadLogs])

  const refreshLogs = () => {
    void loadLogs(page, pageSize, order, dateFilter)
  }

  const handleLogSaved = () => {
    if (page === 1) {
      void loadLogs(1, pageSize, order, dateFilter)
    } else {
      setPage(1)
    }
  }

  const openCreateModal = () => {
    setLogModalMode('create')
    setEditingLog(null)
    setLogModalOpen(true)
  }

  const openEditModal = (row: LogEntry) => {
    setLogModalMode('edit')
    setEditingLog(row)
    setLogModalOpen(true)
  }

  const closeLogModal = () => {
    setLogModalOpen(false)
    setEditingLog(null)
  }

  const handleOrderChange = (nextOrder: GetLogsParams['order']) => {
    setOrder(nextOrder)
    setPage(1)
  }

  const handleDateApply = (dates: DateFilterValue) => {
    setDateFilter(dates)
    setPage(1)
  }

  const handleDateClear = () => {
    setDateFilter(EMPTY_DATE_FILTER)
    setPage(1)
  }

  const handlePageSizeChange = (nextPageSize: PageSize) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Журнал работ</h1>
        <div className="app__toolbar">
          <LogDateFilter
            value={dateFilter}
            onApply={handleDateApply}
            onClear={handleDateClear}
          />
          <Button variant="primary" onClick={openCreateModal}>
            Добавить запись
          </Button>
        </div>
      </header>

      {loading && (
        <p className="app__status" role="status">
          Загрузка…
        </p>
      )}
      {error && (
        <p className="app__status app__status--error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <WorkLogTable
            rows={rows}
            order={order}
            onOrderChange={handleOrderChange}
            onEdit={openEditModal}
            onMutated={refreshLogs}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      <LogFormModal
        open={logModalOpen}
        mode={logModalMode}
        log={editingLog}
        onClose={closeLogModal}
        onSuccess={handleLogSaved}
      />
    </main>
  )
}

export default App
