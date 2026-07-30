import { z } from 'zod'

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  scheduledAt: z.string().min(1, 'Please select a date and time'),
})

export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>

export const rescheduleSchema = z.object({
  scheduledAt: z.string().min(1, 'Please select a new date and time'),
})

export type RescheduleFormData = z.infer<typeof rescheduleSchema>
