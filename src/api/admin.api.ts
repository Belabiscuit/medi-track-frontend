import client from './client'
import type { Role } from '@/lib/constants'
import type { PaginationMeta } from '@/types/api.types'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  gender: string
  specialty?: string
  dateOfBirth?: string
  phone?: string
  createdAt: string
}

export interface UsersQuery {
  role?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  gender: string
  specialty?: string
  dateOfBirth?: string
  phone?: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  gender?: string
  specialty?: string
  dateOfBirth?: string
  phone?: string
}

export interface DemographicsData {
  gender: string
  count: number
}

export interface DiagnosesData {
  condition: string
  count: number
}

export interface AppointmentsAnalyticsData {
  month: string
  total: number
  completed: number
  cancelled: number
}

export const adminApi = {
  getUsers(params: UsersQuery) {
    return client
      .get<{ data: AdminUser[]; meta: PaginationMeta }>('/api/admin/users', { params })
      .then((r) => r.data)
  },

  getUser(role: string, id: string) {
    return client
      .get<AdminUser>(`/api/admin/users/${role}/${id}`)
      .then((r) => r.data)
  },

  createUser(role: string, payload: CreateUserPayload) {
    return client
      .post<AdminUser>(`/api/admin/users/${role}`, payload)
      .then((r) => r.data)
  },

  updateUser(role: string, id: string, payload: UpdateUserPayload) {
    return client
      .put<AdminUser>(`/api/admin/users/${role}/${id}`, payload)
      .then((r) => r.data)
  },

  deleteUser(role: string, id: string) {
    return client
      .delete<void>(`/api/admin/users/${role}/${id}`)
      .then((r) => r.data)
  },

  getDemographics() {
    return client
      .get<DemographicsData[]>('/api/admin/analytics/demographics')
      .then((r) => r.data)
  },

  getDiagnoses() {
    return client
      .get<DiagnosesData[]>('/api/admin/analytics/diagnoses')
      .then((r) => r.data)
  },

  getAppointmentsAnalytics() {
    return client
      .get<AppointmentsAnalyticsData[]>('/api/admin/analytics/appointments')
      .then((r) => r.data)
  },
}
