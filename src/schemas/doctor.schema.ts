import { z } from 'zod'

export const updateDoctorSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  gender: z.string().min(1, 'Gender is required').optional(),
  specialty: z.string().min(1, 'Specialty is required').optional(),
})

export type UpdateDoctorFormData = z.infer<typeof updateDoctorSchema>
