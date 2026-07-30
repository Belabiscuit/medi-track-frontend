import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ role, id }: { role: string; id: string }) =>
      adminApi.deleteUser(role, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
