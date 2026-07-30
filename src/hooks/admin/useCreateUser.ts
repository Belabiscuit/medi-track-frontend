import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type CreateUserPayload } from '@/api/admin.api'

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ role, payload }: { role: string; payload: CreateUserPayload }) =>
      adminApi.createUser(role, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
