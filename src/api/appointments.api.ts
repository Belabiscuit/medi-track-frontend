import client from './client'
import type { Appointment } from '@/types/appointment.types'

export interface BookAppointmentPayload {
  doctorId: string
  scheduledAt: string
}

export interface BookForPatientPayload {
  patientId: string
  doctorId: string
  scheduledAt: string
}

export interface OverridePayload extends BookForPatientPayload {
  reason: string
}

export interface ReschedulePayload {
  scheduledAt: string
}

export interface UpdateAppointmentPayload {
  scheduledAt?: string
  doctorId?: string
  status?: string
}

export const appointmentsApi = {
  getMyAppointments() {
    return client.get<Appointment[]>('/api/patients/me/appointments').then((r) => r.data)
  },

  book(payload: BookAppointmentPayload) {
    return client.post<Appointment>('/api/patients/me/appointments', payload).then((r) => r.data)
  },

  reschedule(id: string, payload: ReschedulePayload) {
    return client.put<Appointment>(`/api/patients/me/appointments/${id}`, payload).then((r) => r.data)
  },

  cancel(id: string) {
    return client.delete<Appointment>(`/api/patients/me/appointments/${id}`).then((r) => r.data)
  },

  createForPatient(payload: BookForPatientPayload) {
    return client.post<Appointment>('/api/appointments', payload).then((r) => r.data)
  },

  override(payload: OverridePayload) {
    return client.post<Appointment>('/api/appointments/override', payload).then((r) => r.data)
  },

  update(id: string, payload: UpdateAppointmentPayload) {
    return client.patch<Appointment>(`/api/appointments/${id}`, payload).then((r) => r.data)
  },

  remove(id: string) {
    return client.delete<Appointment>(`/api/appointments/${id}`).then((r) => r.data)
  },
}
