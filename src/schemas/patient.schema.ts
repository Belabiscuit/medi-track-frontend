import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  gender: z.string().min(1, 'Gender is required').optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
  phone: z.string().optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
