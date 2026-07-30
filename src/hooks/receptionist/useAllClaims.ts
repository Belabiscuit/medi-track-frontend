import { useQuery } from '@tanstack/react-query'
import { insuranceApi } from '@/api/insurance.api'
import type { InsuranceClaim } from '@/types/insurance.types'
import type { PaginationMeta } from '@/types/api.types'

export function useAllClaims(params?: { page?: number; limit?: number }) {
  return useQuery<{ data: InsuranceClaim[]; meta: PaginationMeta }>({
    queryKey: ['receptionist', 'claims', params],
    queryFn: () => insuranceApi.getAllClaims(params),
  })
}
