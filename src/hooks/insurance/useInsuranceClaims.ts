import { useQuery } from '@tanstack/react-query'
import { insuranceApi } from '@/api/insurance.api'

export function useInsuranceClaims() {
  return useQuery({
    queryKey: ['insurance', 'mine'],
    queryFn: () => insuranceApi.getMyClaims(),
  })
}
