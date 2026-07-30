import { useState } from 'react'
import { usePrescriptions } from '@/hooks/prescriptions/usePrescriptions'
import { useRequestRefill } from '@/hooks/prescriptions/useRequestRefill'
import { toast } from 'sonner'
import { handleApiError } from '@/utils/apiErrorHandler'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Pill, RefreshCw } from 'lucide-react'

export default function PrescriptionsPage() {
  const { data: prescriptions, isLoading, error } = usePrescriptions()
  const refillMutation = useRequestRefill()
  const [refillingId, setRefillingId] = useState<string | null>(null)

  const handleRefill = (id: string) => {
    setRefillingId(id)
    refillMutation.mutate(id, {
      onSuccess: () => toast.success('Refill requested'),
      onError: (err) => toast.error(handleApiError(err)),
      onSettled: () => setRefillingId(null),
    })
  }

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />

  if (!prescriptions || prescriptions.length === 0) {
    return <EmptyState title="No prescriptions" description="Your prescriptions will appear here." />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold">My Prescriptions</h2>

      <div className="space-y-3">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-start gap-3">
              <Pill className="mt-1 h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium">
                  {rx.drug} <span className="text-sm text-zinc-400">{rx.dosage}</span>
                </p>
                <p className="text-sm text-zinc-500">
                  {rx.frequency} for {rx.duration}
                </p>
                <p className="text-xs text-zinc-600">
                  Dr. {rx.doctor?.name} &middot; {new Date(rx.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleRefill(rx.id)}
              disabled={refillingId === rx.id}
              className="flex items-center gap-1 rounded bg-green-600/10 px-3 py-1.5 text-xs text-green-400 hover:bg-green-600/20 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${refillingId === rx.id ? 'animate-spin' : ''}`} />
              {refillingId === rx.id ? 'Requesting...' : 'Request Refill'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
