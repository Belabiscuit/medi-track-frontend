import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No data found',
  description,
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
      <Inbox className="mb-2 h-8 w-8 text-zinc-600" />
      <p className="font-medium text-zinc-400">{title}</p>
      {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
    </div>
  )
}
