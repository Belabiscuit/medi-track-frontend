import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookAppointmentPayload } from '@/api/appointments.api'
import { appointmentsApi } from '@/api/appointments.api'

export function useBookAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) => appointmentsApi.book(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] })
    },
  })
}
