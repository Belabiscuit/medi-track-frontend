import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { ROLE_DASHBOARD } from '@/routes/routePaths'
import { handleApiError } from '@/utils/apiErrorHandler'
import { toast } from 'sonner'
import type { RegisterPayload } from '@/types/auth.types'

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
      navigate(ROLE_DASHBOARD[data.user.role], { replace: true })
    },
    onError: (error) => {
      toast.error(handleApiError(error))
    },
  })
}
