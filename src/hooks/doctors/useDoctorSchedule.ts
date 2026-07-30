import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/api/doctors.api'

export function useDoctorSchedule(date?: string) {
  return useQuery({
    queryKey: ['doctors', 'schedule', date],
    queryFn: () => doctorsApi.getMySchedule(date),
  })
}
