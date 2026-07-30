import type { Role } from '@/lib/constants'

export interface AuthUser {
  id: string
  email: string
  role: Role
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  gender: string
  dateOfBirth: string
  phone?: string
}

export interface AdminSignupPayload {
  name: string
  email: string
  password: string
}
