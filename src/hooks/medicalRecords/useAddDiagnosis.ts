import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AddDiagnosisPayload } from '@/api/medicalRecords.api'
import { medicalRecordsApi } from '@/api/medicalRecords.api'

export function useAddDiagnosis(recordId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddDiagnosisPayload) =>
      medicalRecordsApi.addDiagnosis(recordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'medical-records',
      })
    },
  })
}
