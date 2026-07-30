import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insuranceApi } from '@/api/insurance.api'
import type { InsuranceClaim } from '@/types/insurance.types'
import type { ClaimStatus } from '@/lib/constants'

export function useUpdateClaimStatus() {
  const qc = useQueryClient()
  return useMutation<InsuranceClaim, unknown, { id: string; status: ClaimStatus }>({
    mutationFn: ({ id, status }) => insuranceApi.updateClaimStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['receptionist', 'claims'] })
    },
  })
}
