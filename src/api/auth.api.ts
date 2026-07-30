import client from './client'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  AdminSignupPayload,
} from '@/types/auth.types'

export const authApi = {
  register(payload: RegisterPayload) {
    return client
      .post<AuthResponse>('/api/auth/register', payload)
      .then((r) => r.data)
  },

  login(payload: LoginPayload) {
    return client
      .post<AuthResponse>('/api/auth/login', payload)
      .then((r) => r.data)
  },

  adminSignup(payload: AdminSignupPayload) {
    return client
      .post<AuthResponse>('/api/auth/admin/signup', payload)
      .then((r) => r.data)
  },

  adminLogin(payload: LoginPayload) {
    return client
      .post<AuthResponse>('/api/auth/admin/login', payload)
      .then((r) => r.data)
  },
}
