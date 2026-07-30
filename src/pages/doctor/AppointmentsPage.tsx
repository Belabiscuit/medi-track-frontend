import { useDoctorAppointments } from '@/hooks/doctors/useDoctorAppointments'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Calendar } from 'lucide-react'

export default function DoctorAppointmentsPage() {
  const { data: appointments, isLoading, error } = useDoctorAppointments()

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />

  if (!appointments || appointments.length === 0) {
    return <EmptyState title="No upcoming appointments" />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold">Upcoming Appointments</h2>

      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium">{apt.patient?.name}</p>
                <p className="text-sm text-zinc-400">
                  {new Date(apt.scheduledAt).toLocaleString()}
                </p>
              </div>
            </div>
            <AppointmentStatusBadge status={apt.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
