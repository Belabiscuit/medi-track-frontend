import type { AppointmentStatus, ClaimStatus } from '@/lib/constants'

const appointmentStyles: Record<AppointmentStatus, string> = {
  BOOKED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  CHECKED_IN: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/30',
}

const claimStyles: Record<ClaimStatus, string> = {
  SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  IN_REVIEW: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  APPROVED: 'bg-green-500/10 text-green-400 border-green-500/30',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${appointmentStyles[status] ?? ''}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${claimStyles[status] ?? ''}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}
