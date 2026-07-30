import client from './client'
import type { Appointment } from '@/types/appointment.types'
import type { PaginationMeta } from '@/types/api.types'

export interface AppointmentsQuery {
  date?: string
  doctorId?: string
  status?: string
  page?: number
  limit?: number
}

export interface UpdateAppointmentPayload {
  scheduledAt?: string
  doctorId?: string
}

export const receptionistApi = {
  getAppointments(params: AppointmentsQuery) {
    return client
      .get<{ data: Appointment[]; meta: PaginationMeta }>(
        '/api/receptionist/appointments',
        { params },
      )
      .then((r) => r.data)
  },

  updateAppointment(id: string, payload: UpdateAppointmentPayload) {
    return client
      .put<Appointment>(`/api/receptionist/appointments/${id}`, payload)
      .then((r) => r.data)
  },

  checkIn(id: string) {
    return client
      .put<Appointment>(`/api/receptionist/appointments/${id}/check-in`)
      .then((r) => r.data)
  },

  checkOut(id: string) {
    return client
      .put<Appointment>(`/api/receptionist/appointments/${id}/check-out`)
      .then((r) => r.data)
  },
}
