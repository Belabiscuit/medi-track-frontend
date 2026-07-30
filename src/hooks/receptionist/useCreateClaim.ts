import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insuranceApi } from '@/api/insurance.api'
import type { InsuranceClaim } from '@/types/insurance.types'

export function useCreateClaim() {
  const qc = useQueryClient()
  return useMutation<InsuranceClaim, unknown, { patientId: string; appointmentId: string }>({
    mutationFn: (payload) => insuranceApi.createClaim(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receptionist', 'claims'] })
    },
  })
}
