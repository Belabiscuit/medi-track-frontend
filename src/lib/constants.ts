export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  RECEPTIONIST: 'RECEPTIONIST',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const APPOINTMENT_STATUSES = {
  BOOKED: 'BOOKED',
  CHECKED_IN: 'CHECKED_IN',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES]

export const CLAIM_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export type ClaimStatus = (typeof CLAIM_STATUSES)[keyof typeof CLAIM_STATUSES]
