import { useQuery } from '@tanstack/react-query'
import { medicalRecordsApi } from '@/api/medicalRecords.api'

export function useMedicalHistory() {
  return useQuery({
    queryKey: ['medical-records', 'mine'],
    queryFn: () => medicalRecordsApi.getMyHistory(),
  })
}
