import { useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi, type OverridePayload } from '@/api/appointments.api'
import type { Appointment } from '@/types/appointment.types'

export function useOverrideAppointment() {
  const qc = useQueryClient()
  return useMutation<Appointment, unknown, OverridePayload>({
    mutationFn: (payload) => appointmentsApi.override(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receptionist', 'appointments'] })
    },
  })
}
