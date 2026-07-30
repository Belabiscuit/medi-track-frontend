import client from './client'
import type { Doctor } from '@/types/doctor.types'
import type { Appointment } from '@/types/appointment.types'
import type { PaginationMeta } from '@/types/api.types'

export interface UpdateDoctorPayload {
  name?: string
  gender?: string
  specialty?: string
}

export interface ScheduleResponse {
  weekStart: string
  weekEnd: string
  appointments: Appointment[]
}

export const doctorsApi = {
  list() {
    return client
      .get<{ data: Doctor[]; meta: PaginationMeta }>('/api/doctors')
      .then((r) => r.data.data)
  },

  getMyProfile() {
    return client.get<Doctor>('/api/doctors/me').then((r) => r.data)
  },

  updateMyProfile(payload: UpdateDoctorPayload) {
    return client.put<Doctor>('/api/doctors/me', payload).then((r) => r.data)
  },

  getMySchedule(date?: string) {
    const params = date ? { date } : undefined
    return client
      .get<ScheduleResponse>('/api/doctors/me/schedule', { params })
      .then((r) => r.data)
  },

  getMyAppointments() {
    return client
      .get<Appointment[]>('/api/doctors/me/appointments')
      .then((r) => r.data)
  },
}
