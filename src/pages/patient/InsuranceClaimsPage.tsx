import { useInsuranceClaims } from '@/hooks/insurance/useInsuranceClaims'
import { ClaimStatusBadge } from '@/components/common/StatusBadge'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Shield } from 'lucide-react'

export default function InsuranceClaimsPage() {
  const { data: claims, isLoading, error } = useInsuranceClaims()

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />

  if (!claims || claims.length === 0) {
    return <EmptyState title="No insurance claims" description="Your claims will appear here." />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold">My Insurance Claims</h2>

      <div className="space-y-3">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-zinc-400">
                  Claim for appointment on{' '}
                  {claim.appointment
                    ? new Date(claim.appointment.scheduledAt).toLocaleDateString()
                    : claim.appointmentId}
                </p>
                <p className="text-xs text-zinc-600">
                  Submitted {new Date(claim.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ClaimStatusBadge status={claim.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
