import { useQuery } from '@tanstack/react-query'
import { patientsApi } from '@/api/patients.api'

export function usePatientProfile() {
  return useQuery({
    queryKey: ['patients', 'profile'],
    queryFn: () => patientsApi.getMyProfile(),
  })
}
