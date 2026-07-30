import { useQuery } from '@tanstack/react-query'
import { medicalRecordsApi } from '@/api/medicalRecords.api'

export function usePatientHistory(patientId: string) {
  return useQuery({
    queryKey: ['medical-records', 'patient', patientId],
    queryFn: () => medicalRecordsApi.getPatientHistory(patientId),
    enabled: !!patientId,
  })
}
