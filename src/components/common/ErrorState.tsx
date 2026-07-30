import { AlertTriangle } from 'lucide-react'
import { handleApiError } from '@/utils/apiErrorHandler'

export default function ErrorState({
  error,
  onRetry,
}: {
  error: unknown
  onRetry?: () => void
}) {
  const message = handleApiError(error)

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20 p-8 text-center">
      <AlertTriangle className="mb-2 h-8 w-8 text-red-400" />
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded bg-red-800 px-4 py-1.5 text-sm text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  )
}
