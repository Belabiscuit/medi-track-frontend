import { useQuery } from '@tanstack/react-query'
import { receptionistApi, type AppointmentsQuery } from '@/api/receptionist.api'
import type { Appointment } from '@/types/appointment.types'
import type { PaginationMeta } from '@/types/api.types'

export function useAppointments(params: AppointmentsQuery) {
  return useQuery<{ data: Appointment[]; meta: PaginationMeta }>({
    queryKey: ['receptionist', 'appointments', params],
    queryFn: () => receptionistApi.getAppointments(params),
  })
}
