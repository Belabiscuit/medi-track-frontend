import { useQuery } from '@tanstack/react-query'
import type { PatientSearchParams } from '@/api/patients.api'
import { patientsApi } from '@/api/patients.api'

export function usePatientSearch(params: PatientSearchParams) {
  return useQuery({
    queryKey: ['patients', 'search', params],
    queryFn: () => patientsApi.search(params),
    enabled: !!params.name || !!params.condition || !!params.medication,
  })
}
