import { useQuery } from '@tanstack/react-query'
import { patientsApi, type AllPatientsQuery } from '@/api/patients.api'
import type { Patient } from '@/types/patient.types'
import type { PaginationMeta } from '@/types/api.types'

export function useAllPatients(params: AllPatientsQuery) {
  return useQuery<{ data: Patient[]; meta: PaginationMeta }>({
    queryKey: ['receptionist', 'patients', params],
    queryFn: () => patientsApi.getAll(params),
  })
}
