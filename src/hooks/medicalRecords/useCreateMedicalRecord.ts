import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateRecordPayload } from '@/api/medicalRecords.api'
import { medicalRecordsApi } from '@/api/medicalRecords.api'

export function useCreateMedicalRecord(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRecordPayload) =>
      medicalRecordsApi.createRecord(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records', 'patient', patientId] })
    },
  })
}
