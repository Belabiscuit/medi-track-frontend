import { useMutation, useQueryClient } from '@tanstack/react-query'
import { receptionistApi } from '@/api/receptionist.api'
import type { Appointment } from '@/types/appointment.types'

export function useCheckOut() {
  const qc = useQueryClient()
  return useMutation<Appointment, unknown, string>({
    mutationFn: (id) => receptionistApi.checkOut(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receptionist', 'appointments'] })
    },
  })
}
