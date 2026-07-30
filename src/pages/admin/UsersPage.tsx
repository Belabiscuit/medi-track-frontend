import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '@/hooks/admin/useUsers'
import { useDeleteUser } from '@/hooks/admin/useDeleteUser'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import SearchInput from '@/components/common/SearchInput'
import DataTable from '@/components/common/DataTable'
import { TableSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import type { AdminUser } from '@/api/admin.api'
import { useDebounce } from '@/hooks/useDebounce'
import { handleApiError } from '@/utils/apiErrorHandler'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

const ROLE_TABS = ['All', 'PATIENT', 'DOCTOR', 'RECEPTIONIST'] as const

export default function UsersPage() {
  const nav = useNavigate()
  const [roleTab, setRoleTab] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const roleParam = roleTab === 'All' ? undefined : roleTab

  const { data, isLoading, error } = useUsers({
    role: roleParam,
    search: debouncedSearch || undefined,
    page,
    limit,
  })

  const deleteMutation = useDeleteUser()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(
      { role: deleteTarget.role, id: deleteTarget.id },
      {
        onSuccess: () => {
          toast.success('User deleted')
          setDeleteTarget(null)
        },
        onError: (err) => toast.error(handleApiError(err)),
      },
    )
  }

  const columns: ColumnDef<AdminUser>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <span className="font-medium text-white">{row.original.name}</span>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => {
        const role = row.original.role
        const colors: Record<string, string> = {
          PATIENT: 'text-blue-400',
          DOCTOR: 'text-green-400',
          RECEPTIONIST: 'text-purple-400',
          ADMIN: 'text-amber-400',
        }
        return <span className={`font-medium ${colors[role] ?? ''}`}>{role}</span>
      },
    },
    {
      header: 'Details',
      id: 'details',
      cell: ({ row }) => {
        const u = row.original
        if (u.role === 'DOCTOR') return <span className="text-zinc-400">{u.specialty}</span>
        if (u.role === 'PATIENT') return <span className="text-zinc-400">{u.phone ?? '-'}</span>
        return <span className="text-zinc-500">—</span>
      },
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              nav(`/admin/users/${row.original.role}/${row.original.id}/edit`)
            }
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row.original)}
            className="rounded p-1 text-red-400 hover:bg-red-900/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => nav('/admin/users/new')}
          className="flex items-center gap-1 rounded bg-amber-600 px-3 py-1.5 text-sm hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setRoleTab(tab); setPage(1) }}
              className={`rounded px-3 py-1.5 text-sm ${
                roleTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="ml-auto w-64">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by name or email..." />
        </div>
      </div>

      {isLoading && <TableSkeleton rows={10} cols={6} />}
      {error && <ErrorState error={error} />}

      {!isLoading && !error && (!data || data.data.length === 0) && (
        <EmptyState
          title="No users found"
          description={search ? 'Try a different search.' : 'No users have been registered yet.'}
        />
      )}

      {!isLoading && !error && data && data.data.length > 0 && (
        <DataTable
          columns={columns}
          data={data.data}
          pagination={data.meta}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1) }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
