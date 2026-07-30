import { useMutation, useQueryClient } from '@tanstack/react-query'
import { prescriptionsApi } from '@/api/prescriptions.api'

export function useRequestRefill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => prescriptionsApi.requestRefill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', 'mine'] })
    },
  })
}
