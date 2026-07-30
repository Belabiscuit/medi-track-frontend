import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReschedulePayload } from '@/api/appointments.api'
import { appointmentsApi } from '@/api/appointments.api'

export function useRescheduleAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReschedulePayload }) =>
      appointmentsApi.reschedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] })
    },
  })
}
