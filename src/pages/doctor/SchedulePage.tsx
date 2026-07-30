import { useState } from 'react'
import { useDoctorSchedule } from '@/hooks/doctors/useDoctorSchedule'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getWeekStart(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(d: Date) {
  return d.toISOString().substring(0, 10)
}

export default function SchedulePage() {
  const [refDate, setRefDate] = useState(formatDate(new Date()))
  const { data: schedule, isLoading, error } = useDoctorSchedule(refDate)

  const weekStart = getWeekStart(new Date(refDate))
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const goBack = () => {
    const d = new Date(refDate)
    d.setDate(d.getDate() - 7)
    setRefDate(formatDate(d))
  }

  const goForward = () => {
    const d = new Date(refDate)
    d.setDate(d.getDate() + 7)
    setRefDate(formatDate(d))
  }

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Schedule</h2>
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="rounded p-1 hover:bg-zinc-800">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-zinc-400">
            {weekStart.toLocaleDateString()} – {weekEnd.toLocaleDateString()}
          </span>
          <button onClick={goForward} className="rounded p-1 hover:bg-zinc-800">
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => setRefDate(formatDate(new Date()))}
            className="rounded bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
          >
            Today
          </button>
        </div>
      </div>

      {!schedule || schedule.appointments.length === 0 ? (
        <EmptyState title="No appointments this week" />
      ) : (
        <div className="space-y-3">
          {schedule.appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
            >
              <div>
                <p className="font-medium text-white">{apt.patient?.name}</p>
                <p className="text-sm text-zinc-400">
                  {new Date(apt.scheduledAt).toLocaleString()}
                </p>
              </div>
              <AppointmentStatusBadge status={apt.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
