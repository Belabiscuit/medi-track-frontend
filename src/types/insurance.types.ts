import type { ClaimStatus } from '@/lib/constants'

interface ClaimPatient {
  id: string
  name: string
}

interface ClaimAppointment {
  id: string
  scheduledAt: string
}

export interface InsuranceClaim {
  id: string
  patientId: string
  appointmentId: string
  status: ClaimStatus
  createdAt: string
  patient?: ClaimPatient
  appointment?: ClaimAppointment
}
