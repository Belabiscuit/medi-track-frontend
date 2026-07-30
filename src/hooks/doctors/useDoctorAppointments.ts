import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/api/doctors.api'

export function useDoctorAppointments() {
  return useQuery({
    queryKey: ['doctors', 'appointments'],
    queryFn: () => doctorsApi.getMyAppointments(),
  })
}
