import { useState } from 'react'
import { useAllPatients } from '@/hooks/receptionist/useAllPatients'
import SearchInput from '@/components/common/SearchInput'
import DataTable from '@/components/common/DataTable'
import { TableSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import type { Patient } from '@/types/patient.types'
import type { ColumnDef } from '@tanstack/react-table'
import { useDebounce } from '@/hooks/useDebounce'

export default function PatientListPage() {
  const [name, setName] = useState('')
  const debouncedName = useDebounce(name, 300)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)

  const { data, isLoading, error } = useAllPatients({
    name: debouncedName || undefined,
    page,
    limit,
  })

  const columns: ColumnDef<Patient>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ row }) => row.original.phone ?? '-',
    },
    {
      header: 'Date of Birth',
      accessorKey: 'dateOfBirth',
      cell: ({ row }) =>
        row.original.dateOfBirth
          ? new Date(row.original.dateOfBirth).toLocaleDateString()
          : '-',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="mb-6 text-2xl font-bold">Patients</h2>

      <div className="mb-4">
        <SearchInput
          value={name}
          onChange={(v) => { setName(v); setPage(1) }}
          placeholder="Search patients by name..."
        />
      </div>

      {isLoading && <TableSkeleton rows={8} cols={4} />}
      {error && <ErrorState error={error} />}

      {!isLoading && !error && (!data || data.data.length === 0) && (
        <EmptyState
          title="No patients found"
          description={name ? 'Try a different search term.' : 'No patients have been registered yet.'}
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
    </div>
  )
}
