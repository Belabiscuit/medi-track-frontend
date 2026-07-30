import { useState } from 'react'
import { useAllClaims } from '@/hooks/receptionist/useAllClaims'
import { useCreateClaim } from '@/hooks/receptionist/useCreateClaim'
import { useUpdateClaimStatus } from '@/hooks/receptionist/useUpdateClaimStatus'
import { ClaimStatusBadge } from '@/components/common/StatusBadge'
import DataTable from '@/components/common/DataTable'
import { TableSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import type { InsuranceClaim } from '@/types/insurance.types'
import type { ClaimStatus } from '@/lib/constants'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { handleApiError } from '@/utils/apiErrorHandler'

export default function InsuranceClaimsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [showCreate, setShowCreate] = useState(false)
  const [claimPatientId, setClaimPatientId] = useState('')
  const [claimAppointmentId, setClaimAppointmentId] = useState('')

  const { data, isLoading, error } = useAllClaims({ page, limit })
  const createClaim = useCreateClaim()
  const updateStatus = useUpdateClaimStatus()

  const handleCreate = () => {
    if (!claimPatientId || !claimAppointmentId) return
    createClaim.mutate(
      { patientId: claimPatientId, appointmentId: claimAppointmentId },
      {
        onSuccess: () => {
          toast.success('Claim created')
          setShowCreate(false)
          setClaimPatientId('')
          setClaimAppointmentId('')
        },
        onError: (err) => {
          toast.error(handleApiError(err))
        },
      },
    )
  }

  const handleStatusChange = (id: string, status: ClaimStatus) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success('Claim status updated'),
        onError: (err) => toast.error(handleApiError(err)),
      },
    )
  }

  const columns: ColumnDef<InsuranceClaim>[] = [
    {
      header: 'Patient',
      accessorKey: 'patient.name',
      cell: ({ row }) => row.original.patient?.name ?? '-',
    },
    {
      header: 'Appointment',
      accessorKey: 'appointment.scheduledAt',
      cell: ({ row }) =>
        row.original.appointment
          ? new Date(row.original.appointment.scheduledAt).toLocaleDateString()
          : '-',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <ClaimStatusBadge status={row.original.status} />,
    },
    {
      header: 'Update',
      id: 'actions',
      cell: ({ row }) => (
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleStatusChange(row.original.id, e.target.value as ClaimStatus)
            }
          }}
          className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-white outline-none"
        >
          <option value="">Change to…</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="IN_REVIEW">IN REVIEW</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Insurance Claims</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {showCreate ? 'Cancel' : 'Create Claim'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-3 font-semibold text-white">New Insurance Claim</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Patient ID</label>
              <input
                type="text"
                value={claimPatientId}
                onChange={(e) => setClaimPatientId(e.target.value)}
                placeholder="Enter patient ID..."
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Appointment ID</label>
              <input
                type="text"
                value={claimAppointmentId}
                onChange={(e) => setClaimAppointmentId(e.target.value)}
                placeholder="Enter appointment ID..."
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-zinc-600">
              Enter the patient and appointment IDs. You can find these in the Appointments Calendar or
              Patients list.
            </p>
            <button
              onClick={handleCreate}
              disabled={!claimPatientId || !claimAppointmentId || createClaim.isPending}
              className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createClaim.isPending ? 'Creating...' : 'Submit Claim'}
            </button>
          </div>
        </div>
      )}

      {isLoading && <TableSkeleton rows={8} cols={4} />}
      {error && <ErrorState error={error} />}

      {!isLoading && !error && (!data || data.data.length === 0) && (
        <EmptyState
          title="No claims found"
          description="Create a claim to get started."
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
