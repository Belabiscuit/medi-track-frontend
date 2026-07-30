import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationMeta {
  page: number
  limit: number
  total: number
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  pagination?: PaginationMeta
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export default function DataTable<T>({
  columns,
  data,
  pagination,
  onPageChange,
  onLimitChange,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 0

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-zinc-800 bg-zinc-900">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium text-zinc-400">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-white outline-none"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Page {pagination.page} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded p-1 hover:bg-zinc-800 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                className="rounded p-1 hover:bg-zinc-800 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
