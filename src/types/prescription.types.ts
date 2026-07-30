interface PrescriptionDoctor {
  id: string
  name: string
  specialty?: string
}

interface PrescriptionPatient {
  id: string
  name: string
}

interface PrescriptionDiagnosis {
  condition: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  diagnosisId?: string
  drug: string
  dosage: string
  frequency: string
  duration: string
  createdAt: string
  doctor?: PrescriptionDoctor
  patient?: PrescriptionPatient
  diagnosis?: PrescriptionDiagnosis
}
