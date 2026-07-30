import client from './client'
import type { InsuranceClaim } from '@/types/insurance.types'
import type { PaginationMeta } from '@/types/api.types'
import type { ClaimStatus } from '@/lib/constants'

export interface CreateClaimPayload {
  patientId: string
  appointmentId: string
}

export interface UpdateClaimStatusPayload {
  status: ClaimStatus
}

export const insuranceApi = {
  getMyClaims() {
    return client.get<InsuranceClaim[]>('/api/insurance/me').then((r) => r.data)
  },

  getAllClaims(params?: { page?: number; limit?: number }) {
    return client
      .get<{ data: InsuranceClaim[]; meta: PaginationMeta }>('/api/insurance', { params })
      .then((r) => r.data)
  },

  createClaim(payload: CreateClaimPayload) {
    return client.post<InsuranceClaim>('/api/insurance', payload).then((r) => r.data)
  },

  updateClaimStatus(id: string, payload: UpdateClaimStatusPayload) {
    return client.put<InsuranceClaim>(`/api/insurance/${id}`, payload).then((r) => r.data)
  },
}
