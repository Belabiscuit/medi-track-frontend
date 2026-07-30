import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { Role } from '@/lib/constants'

export default function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[]
  children: ReactNode
}) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
