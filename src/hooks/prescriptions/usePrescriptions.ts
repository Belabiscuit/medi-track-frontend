import { useQuery } from '@tanstack/react-query'
import { prescriptionsApi } from '@/api/prescriptions.api'

export function usePrescriptions() {
  return useQuery({
    queryKey: ['prescriptions', 'mine'],
    queryFn: () => prescriptionsApi.getMine(),
  })
}
