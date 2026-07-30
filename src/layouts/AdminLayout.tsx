import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/routes/routePaths'
import NotificationBell from '@/components/notifications/NotificationBell'
import { notificationsApi } from '@/api/notifications.api'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const NAV = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.ADMIN_USERS, label: 'Users', icon: Users },
  { to: ROUTES.ADMIN_ANALYTICS, label: 'Analytics', icon: BarChart3 },
]

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [triggering, setTriggering] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const handleTrigger = async () => {
    setTriggering(true)
    try {
      const res = await notificationsApi.triggerReminders()
      toast.success(`Reminders generated: ${res.remindersGenerated}`)
    } catch {
      toast.error('Failed to trigger reminders')
    } finally {
      setTriggering(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <aside className="flex w-56 flex-col border-r border-zinc-800">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-600 text-sm font-bold">
            M
          </div>
          <span className="text-lg font-bold">MediTrack</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-600/10 text-amber-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-3">
          <div className="mb-2 truncate px-3 text-xs text-zinc-500">
            {user?.email}
          </div>
          <div className="mb-2 px-3 text-xs text-zinc-600">ADMIN</div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-4 flex items-center justify-end gap-3">
          <button
            onClick={handleTrigger}
            disabled={triggering}
            className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {triggering ? 'Triggering...' : 'Trigger Reminder Run'}
          </button>
          <NotificationBell />
        </div>
        <Outlet />
      </main>
    </div>
  )
}
