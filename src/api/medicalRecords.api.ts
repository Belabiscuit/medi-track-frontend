import client from './client'
import type { Appointment } from '@/types/appointment.types'
import type { MedicalRecord, Diagnosis } from '@/types/medicalRecord.types'
import type { Prescription } from '@/types/prescription.types'

export interface MedicalHistory {
  appointments: Appointment[]
  medicalRecords: MedicalRecord[]
  prescriptions: Prescription[]
}

export interface CreateRecordPayload {
  notes: string
}

export interface AddDiagnosisPayload {
  condition: string
  notes?: string
}

export const medicalRecordsApi = {
  getMyHistory() {
    return client.get<MedicalHistory>('/api/medical-records/me').then((r) => r.data)
  },

  getPatientHistory(patientId: string) {
    return client
      .get<MedicalHistory>(`/api/medical-records/patient/${patientId}`)
      .then((r) => r.data)
  },

  createRecord(patientId: string, payload: CreateRecordPayload) {
    return client
      .post<MedicalRecord>(`/api/medical-records/patient/${patientId}`, payload)
      .then((r) => r.data)
  },

  addDiagnosis(recordId: string, payload: AddDiagnosisPayload) {
    return client
      .post<Diagnosis>(`/api/medical-records/${recordId}/diagnoses`, payload)
      .then((r) => r.data)
  },
}
