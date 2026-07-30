import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/api/doctors.api'

export function useDoctorProfile() {
  return useQuery({
    queryKey: ['doctors', 'profile'],
    queryFn: () => doctorsApi.getMyProfile(),
  })
}
