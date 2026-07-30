import { z } from 'zod'

export const createRecordSchema = z.object({
  notes: z.string().min(1, 'Notes are required'),
})

export type CreateRecordFormData = z.infer<typeof createRecordSchema>

export const addDiagnosisSchema = z.object({
  condition: z.string().min(1, 'Condition is required'),
  notes: z.string().optional(),
})

export type AddDiagnosisFormData = z.infer<typeof addDiagnosisSchema>
