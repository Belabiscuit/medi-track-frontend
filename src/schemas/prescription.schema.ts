import { z } from 'zod'

export const createPrescriptionSchema = z.object({
  drug: z.string().min(1, 'Drug name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  diagnosisId: z.string().optional(),
})

export type CreatePrescriptionFormData = z.infer<typeof createPrescriptionSchema>
