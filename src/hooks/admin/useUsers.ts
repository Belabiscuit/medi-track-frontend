import { useQuery } from '@tanstack/react-query'
import { adminApi, type AdminUser, type UsersQuery } from '@/api/admin.api'
import type { PaginationMeta } from '@/types/api.types'

export function useUsers(params: UsersQuery) {
  return useQuery<{ data: AdminUser[]; meta: PaginationMeta }>({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getUsers(params),
  })
}
