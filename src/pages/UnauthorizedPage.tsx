import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/routes/routePaths'

export default function UnauthorizedPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleGoBack = () => {
    const role = user?.role
    if (role === 'PATIENT') navigate(ROUTES.PATIENT_DASHBOARD, { replace: true })
    else if (role === 'DOCTOR') navigate(ROUTES.DOCTOR_DASHBOARD, { replace: true })
    else if (role === 'RECEPTIONIST') navigate(ROUTES.RECEPTIONIST_DASHBOARD, { replace: true })
    else if (role === 'ADMIN') navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
    else navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-600">403</h1>
        <p className="mt-2 text-zinc-400">You do not have access to this page</p>
        <button
          onClick={handleGoBack}
          className="mt-4 rounded bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
