import { useQuery } from '@tanstack/react-query'
import { appointmentsApi } from '@/api/appointments.api'

export function usePatientAppointments() {
  return useQuery({
    queryKey: ['appointments', 'mine'],
    queryFn: () => appointmentsApi.getMyAppointments(),
  })
}
