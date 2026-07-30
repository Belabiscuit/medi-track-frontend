import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type UpdateUserPayload } from '@/api/admin.api'

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      role,
      id,
      payload,
    }: {
      role: string
      id: string
      payload: UpdateUserPayload
    }) => adminApi.updateUser(role, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
