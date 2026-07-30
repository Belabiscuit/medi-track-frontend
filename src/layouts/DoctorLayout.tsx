import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/routes/routePaths'
import NotificationBell from '@/components/notifications/NotificationBell'
import {
  LayoutDashboard,
  Calendar,
  CalendarRange,
  Users,
  FileText,
  Pill,
  LogOut,
} from 'lucide-react'

const NAV = [
  { to: ROUTES.DOCTOR_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.DOCTOR_SCHEDULE, label: 'Schedule', icon: CalendarRange },
  { to: ROUTES.DOCTOR_APPOINTMENTS, label: 'Appointments', icon: Calendar },
  { to: ROUTES.DOCTOR_PATIENTS, label: 'Patients', icon: Users },
  { to: ROUTES.DOCTOR_MEDICAL_RECORDS, label: 'Medical Records', icon: FileText },
  { to: ROUTES.DOCTOR_PRESCRIPTIONS, label: 'Prescriptions', icon: Pill },
]

export default function DoctorLayout() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <aside className="flex w-56 flex-col border-r border-zinc-800">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600 text-sm font-bold">
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
                    ? 'bg-green-600/10 text-green-400'
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
          <div className="mb-2 px-3 text-xs text-zinc-600">DOCTOR</div>
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
        <div className="mb-4 flex items-center justify-end">
          <NotificationBell />
        </div>
        <Outlet />
      </main>
    </div>
  )
}
