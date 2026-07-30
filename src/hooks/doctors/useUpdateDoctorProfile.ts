import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateDoctorPayload } from '@/api/doctors.api'
import { doctorsApi } from '@/api/doctors.api'

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateDoctorPayload) => doctorsApi.updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors', 'profile'] })
    },
  })
}
