import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePatientAppointments } from '@/hooks/appointments/usePatientAppointments'
import { useBookAppointment } from '@/hooks/appointments/useBookAppointment'
import { useCancelAppointment } from '@/hooks/appointments/useCancelAppointment'
import { useDoctors } from '@/hooks/patients/useDoctors'
import { bookAppointmentSchema, type BookAppointmentFormData } from '@/schemas/appointment.schema'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { toast } from 'sonner'
import { handleApiError } from '@/utils/apiErrorHandler'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Calendar, X, Plus } from 'lucide-react'

export default function AppointmentsPage() {
  const { data: appointments, isLoading, error } = usePatientAppointments()
  const { data: doctors } = useDoctors()
  const bookMutation = useBookAppointment()
  const cancelMutation = useCancelAppointment()
  const [showForm, setShowForm] = useState(false)

  const form = useForm<BookAppointmentFormData>({
    resolver: zodResolver(bookAppointmentSchema),
  })

  const onSubmit = form.handleSubmit((data) => {
    bookMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Appointment booked')
        setShowForm(false)
        form.reset()
      },
      onError: (err) => toast.error(handleApiError(err)),
    })
  })

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />

  const upcoming = appointments?.filter((a) => a.status === 'BOOKED' || a.status === 'CHECKED_IN') ?? []
  const past = appointments?.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED') ?? []

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Appointments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">New Appointment</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Doctor</label>
              <select
                {...form.register('doctorId')}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="">Select a doctor</option>
                {doctors?.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
              {form.formState.errors.doctorId && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.doctorId.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-400">Date & Time</label>
              <input
                type="datetime-local"
                {...form.register('scheduledAt')}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              {form.formState.errors.scheduledAt && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.scheduledAt.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={bookMutation.isPending}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-zinc-300">Upcoming</h3>
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming appointments" description="Book one to get started." />
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">
                      Dr. {apt.doctor?.name} <span className="text-sm text-zinc-500">({apt.doctor?.specialty})</span>
                    </p>
                    <p className="text-sm text-zinc-400">
                      {new Date(apt.scheduledAt).toLocaleString()}
                    </p>
                    <div className="mt-1">
                      <AppointmentStatusBadge status={apt.status} />
                    </div>
                  </div>
                </div>
                {apt.status === 'BOOKED' && (
                  <button
                    onClick={() =>
                      cancelMutation.mutate(apt.id, {
                        onSuccess: () => toast.success('Appointment cancelled'),
                        onError: (err) => toast.error(handleApiError(err)),
                      })
                    }
                    disabled={cancelMutation.isPending}
                    className="rounded bg-red-600/10 px-3 py-1 text-xs text-red-400 hover:bg-red-600/20"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-zinc-500">Past</h3>
          <div className="space-y-2">
            {past.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 opacity-60"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-zinc-600" />
                  <div>
                    <p className="font-medium">
                      Dr. {apt.doctor?.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {new Date(apt.scheduledAt).toLocaleString()}
                    </p>
                    <div className="mt-1">
                      <AppointmentStatusBadge status={apt.status} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
