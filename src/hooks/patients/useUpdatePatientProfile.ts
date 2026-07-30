import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdatePatientPayload } from '@/api/patients.api'
import { patientsApi } from '@/api/patients.api'

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePatientPayload) => patientsApi.updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', 'profile'] })
    },
  })
}
