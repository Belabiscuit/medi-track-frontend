export interface Diagnosis {
  id: string
  recordId: string
  condition: string
  notes?: string
}

interface RecordDoctor {
  id: string
  name: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  notes: string
  createdAt: string
  doctor?: RecordDoctor
  diagnoses?: Diagnosis[]
}
