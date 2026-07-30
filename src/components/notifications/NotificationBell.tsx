import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/hooks/notifications/useNotifications'
import { Bell } from 'lucide-react'
import type { Notification } from '@/types/notification.types'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: notifications } = useNotifications()

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const count = notifications?.length ?? 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg">
          <div className="border-b border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400">
            Notifications
          </div>

          {(!notifications || notifications.length === 0) && (
            <div className="px-4 py-6 text-center text-sm text-zinc-500">
              No notifications
            </div>
          )}

          {notifications && notifications.length > 0 && (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="border-b border-zinc-800 px-4 py-3 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <TypeBadge type={n.type} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white">{n.message}</p>
                      {n.scheduledAt && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {new Date(n.scheduledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    APPOINTMENT_REMINDER: 'bg-blue-500/10 text-blue-400',
    CHECK_IN_REMINDER: 'bg-yellow-500/10 text-yellow-400',
    CLAIM_UPDATE: 'bg-purple-500/10 text-purple-400',
    GENERAL: 'bg-zinc-500/10 text-zinc-400',
  }
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
        colors[type] ?? 'bg-zinc-500/10 text-zinc-400'
      }`}
    >
      {type.replace(/_/g, ' ')}
    </span>
  )
}
