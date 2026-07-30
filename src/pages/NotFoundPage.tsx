import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROLE_DASHBOARD } from '@/routes/routePaths'

export default function NotFoundPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleGoHome = () => {
    if (user?.role) {
      navigate(ROLE_DASHBOARD[user.role], { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-600">404</h1>
        <p className="mt-2 text-zinc-400">Page not found</p>
        <button
          onClick={handleGoHome}
          className="mt-4 rounded bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
