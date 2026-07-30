import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/api/doctors.api'
import { useAppointments } from '@/hooks/receptionist/useAppointments'
import { useCheckIn } from '@/hooks/receptionist/useCheckIn'
import { useCheckOut } from '@/hooks/receptionist/useCheckOut'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import DataTable from '@/components/common/DataTable'
import { TableSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import type { Appointment } from '@/types/appointment.types'
import type { ColumnDef } from '@tanstack/react-table'
import { CalendarPlus, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { handleApiError } from '@/utils/apiErrorHandler'

const STATUS_OPTIONS = ['', 'BOOKED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'] as const

export default function CalendarPage() {
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10))
  const [doctorId, setDoctorId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorsApi.list(),
  })

  const { data, isLoading, error } = useAppointments({
    date: date || undefined,
    doctorId: doctorId || undefined,
    status: status || undefined,
    page,
    limit: 50,
  })

  const checkIn = useCheckIn()
  const checkOut = useCheckOut()

  const handleCheckIn = (id: string) => {
    checkIn.mutate(id, {
      onSuccess: () => toast.success('Patient checked in'),
      onError: (err) => toast.error(handleApiError(err)),
    })
  }

  const handleCheckOut = (id: string) => {
    checkOut.mutate(id, {
      onSuccess: () => toast.success('Patient checked out'),
      onError: (err) => toast.error(handleApiError(err)),
    })
  }

  const columns: ColumnDef<Appointment>[] = [
    {
      header: 'Patient',
      accessorKey: 'patient.name',
      cell: ({ row }) => row.original.patient?.name ?? '-',
    },
    {
      header: 'Doctor',
      accessorKey: 'doctor.name',
      cell: ({ row }) => row.original.doctor?.name ?? '-',
    },
    {
      header: 'Time',
      accessorKey: 'scheduledAt',
      cell: ({ row }) => new Date(row.original.scheduledAt).toLocaleString(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <AppointmentStatusBadge status={row.original.status} />,
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const apt = row.original
        return (
          <div className="flex gap-1">
            {apt.status === 'BOOKED' && (
              <button
                onClick={() => handleCheckIn(apt.id)}
                disabled={checkIn.isPending}
                className="rounded bg-yellow-600 px-2 py-1 text-xs hover:bg-yellow-700 disabled:opacity-50"
              >
                Check In
              </button>
            )}
            {apt.status === 'CHECKED_IN' && (
              <button
                onClick={() => handleCheckOut(apt.id)}
                disabled={checkOut.isPending}
                className="rounded bg-green-600 px-2 py-1 text-xs hover:bg-green-700 disabled:opacity-50"
              >
                Check Out
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Appointments Calendar</h2>
        <div className="flex gap-2">
          <Link
            to="/receptionist/appointments/book"
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700"
          >
            <CalendarPlus className="h-4 w-4" /> Book Appointment
          </Link>
          <Link
            to="/receptionist/appointments/check-in-out"
            className="flex items-center gap-1 rounded bg-purple-600 px-3 py-1.5 text-sm hover:bg-purple-700"
          >
            <UserCheck className="h-4 w-4" /> Check In / Out
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1) }}
            className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Doctor</label>
          <select
            value={doctorId}
            onChange={(e) => { setDoctorId(e.target.value); setPage(1) }}
            className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="">All Doctors</option>
            {doctors?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <TableSkeleton rows={8} cols={5} />}
      {error && <ErrorState error={error} />}

      {!isLoading && !error && data && data.data.length === 0 && (
        <EmptyState
          title="No appointments found"
          description="Try changing the filters or date."
        />
      )}

      {!isLoading && !error && data && data.data.length > 0 && (
        <DataTable
          columns={columns}
          data={data.data}
          pagination={data.meta}
          onPageChange={setPage}
          onLimitChange={() => {}}
        />
      )}
    </div>
  )
}
