import { useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi, type BookForPatientPayload } from '@/api/appointments.api'
import type { Appointment } from '@/types/appointment.types'

export function useBookAppointment() {
  const qc = useQueryClient()
  return useMutation<Appointment, unknown, BookForPatientPayload>({
    mutationFn: (payload) => appointmentsApi.createForPatient(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receptionist', 'appointments'] })
    },
  })
}
