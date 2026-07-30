import { useMemo } from 'react'
import { useAppointments } from '@/hooks/receptionist/useAppointments'
import { useCheckIn } from '@/hooks/receptionist/useCheckIn'
import { useCheckOut } from '@/hooks/receptionist/useCheckOut'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { LogIn, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { handleApiError } from '@/utils/apiErrorHandler'

export default function CheckInOutPage() {
  const today = useMemo(() => new Date().toISOString().substring(0, 10), [])

  const { data, isLoading, error } = useAppointments({ date: today, limit: 200 })

  const checkIn = useCheckIn()
  const checkOut = useCheckOut()

  const booked = useMemo(
    () => data?.data.filter((a) => a.status === 'BOOKED') ?? [],
    [data],
  )
  const checkedIn = useMemo(
    () => data?.data.filter((a) => a.status === 'CHECKED_IN') ?? [],
    [data],
  )

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

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-2xl font-bold">Check In / Out</h2>

      <section className="mb-8">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-400">
          <LogIn className="h-5 w-5" /> Ready for Check-In
          <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
            {booked.length}
          </span>
        </h3>

        {booked.length === 0 ? (
          <EmptyState title="No patients to check in" />
        ) : (
          <div className="space-y-2">
            {booked.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div>
                  <p className="font-medium text-white">{apt.patient?.name}</p>
                  <p className="text-sm text-zinc-500">
                    {apt.doctor?.name} —{' '}
                    {new Date(apt.scheduledAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AppointmentStatusBadge status={apt.status} />
                  <button
                    onClick={() => handleCheckIn(apt.id)}
                    disabled={checkIn.isPending}
                    className="rounded bg-yellow-600 px-3 py-1.5 text-sm hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {checkIn.isPending ? '...' : 'Check In'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-400">
          <LogOut className="h-5 w-5" /> Checked In
          <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
            {checkedIn.length}
          </span>
        </h3>

        {checkedIn.length === 0 ? (
          <EmptyState title="No patients checked in" />
        ) : (
          <div className="space-y-2">
            {checkedIn.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div>
                  <p className="font-medium text-white">{apt.patient?.name}</p>
                  <p className="text-sm text-zinc-500">
                    {apt.doctor?.name} —{' '}
                    {new Date(apt.scheduledAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AppointmentStatusBadge status={apt.status} />
                  <button
                    onClick={() => handleCheckOut(apt.id)}
                    disabled={checkOut.isPending}
                    className="rounded bg-green-600 px-3 py-1.5 text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {checkOut.isPending ? '...' : 'Check Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
