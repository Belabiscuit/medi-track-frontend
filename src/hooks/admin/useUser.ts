import { useQuery } from '@tanstack/react-query'
import { adminApi, type AdminUser } from '@/api/admin.api'

export function useUser(role: string | undefined, id: string | undefined) {
  return useQuery<AdminUser>({
    queryKey: ['admin', 'users', role, id],
    queryFn: () => adminApi.getUser(role!, id!),
    enabled: !!role && !!id,
  })
}
