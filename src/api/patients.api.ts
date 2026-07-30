import client from './client'
import type { Patient } from '@/types/patient.types'
import type { PaginationMeta } from '@/types/api.types'

export interface UpdatePatientPayload {
  name?: string
  gender?: string
  dateOfBirth?: string
  phone?: string
}

export interface PatientSearchParams {
  name?: string
  condition?: string
  medication?: string
}

export interface AllPatientsQuery {
  page?: number
  limit?: number
  name?: string
}

export const patientsApi = {
  getMyProfile() {
    return client.get<Patient>('/api/patients/me').then((r) => r.data)
  },

  updateMyProfile(payload: UpdatePatientPayload) {
    return client.put<Patient>('/api/patients/me', payload).then((r) => r.data)
  },

  search(params: PatientSearchParams) {
    return client
      .get<Patient[]>('/api/patients/search', { params })
      .then((r) => r.data)
  },

  getAll(params: AllPatientsQuery) {
    return client
      .get<{ data: Patient[]; meta: PaginationMeta }>('/api/patients', { params })
      .then((r) => r.data)
  },
}
