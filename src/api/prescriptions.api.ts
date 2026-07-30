import client from './client'
import type { Prescription } from '@/types/prescription.types'

export interface RefillResponse {
  message: string
  prescriptionId: string
  drug: string
  requestedAt: string
}

export interface CreatePrescriptionPayload {
  patientId: string
  diagnosisId?: string
  drug: string
  dosage: string
  frequency: string
  duration: string
}

export const prescriptionsApi = {
  getMine() {
    return client.get<Prescription[]>('/api/prescriptions/me').then((r) => r.data)
  },

  requestRefill(id: string) {
    return client.post<RefillResponse>(`/api/prescriptions/me/${id}/refill`).then((r) => r.data)
  },

  create(payload: CreatePrescriptionPayload) {
    return client
      .post<Prescription>('/api/prescriptions', payload)
      .then((r) => r.data)
  },
}
