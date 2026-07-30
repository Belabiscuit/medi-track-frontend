import { useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '@/api/appointments.api'

export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] })
    },
  })
}
