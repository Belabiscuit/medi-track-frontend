import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreatePrescriptionPayload } from '@/api/prescriptions.api'
import { prescriptionsApi } from '@/api/prescriptions.api'

export function useCreatePrescription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) =>
      prescriptionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'medical-records',
      })
    },
  })
}
