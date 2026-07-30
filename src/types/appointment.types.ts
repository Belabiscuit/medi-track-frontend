import type { AppointmentStatus } from '@/lib/constants'

interface AppointmentPatient {
  id: string
  name: string
  phone?: string
}

interface AppointmentDoctor {
  id: string
  name: string
  specialty: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  scheduledAt: string
  status: AppointmentStatus
  createdAt: string
  patient?: AppointmentPatient
  doctor?: AppointmentDoctor
}
