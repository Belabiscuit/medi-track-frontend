import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePatientHistory } from '@/hooks/medicalRecords/usePatientHistory'
import { useCreateMedicalRecord } from '@/hooks/medicalRecords/useCreateMedicalRecord'
import { useAddDiagnosis } from '@/hooks/medicalRecords/useAddDiagnosis'
import { useCreatePrescription } from '@/hooks/prescriptions/useCreatePrescription'
import { createRecordSchema, type CreateRecordFormData } from '@/schemas/medicalRecord.schema'
import { addDiagnosisSchema, type AddDiagnosisFormData } from '@/schemas/medicalRecord.schema'
import {
  createPrescriptionSchema,
  type CreatePrescriptionFormData,
} from '@/schemas/prescription.schema'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { ArrowLeft, FileText, Stethoscope, Pill, Plus, Calendar } from 'lucide-react'

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { data: history, isLoading, error } = usePatientHistory(patientId!)
  const createRecordMutation = useCreateMedicalRecord(patientId!)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)
  const [showPrescribeForm, setShowPrescribeForm] = useState(false)

  const recordForm = useForm<CreateRecordFormData>({
    resolver: zodResolver(createRecordSchema),
  })

  const diagnosisForm = useForm<AddDiagnosisFormData>({
    resolver: zodResolver(addDiagnosisSchema),
  })

  const prescribeForm = useForm<CreatePrescriptionFormData>({
    resolver: zodResolver(createPrescriptionSchema),
  })

  const onSubmitRecord = recordForm.handleSubmit((data) => {
    createRecordMutation.mutate(data, {
      onSuccess: () => {
        setShowRecordForm(false)
        recordForm.reset()
      },
    })
  })

  const addDiagnosisMutation = useAddDiagnosis(activeRecordId ?? '')

  const onSubmitDiagnosis = diagnosisForm.handleSubmit((data) => {
    if (!activeRecordId) return
    addDiagnosisMutation.mutate(data, {
      onSuccess: () => {
        setActiveRecordId(null)
        diagnosisForm.reset()
      },
    })
  })

  const createPrescriptionMutation = useCreatePrescription()

  const onSubmitPrescribe = prescribeForm.handleSubmit((data) => {
    createPrescriptionMutation.mutate(
      { ...data, patientId: patientId!, diagnosisId: data.diagnosisId || undefined },
      {
        onSuccess: () => {
          setShowPrescribeForm(false)
          prescribeForm.reset()
        },
      },
    )
  })

  const err = error as { statusCode?: number; message?: string } | null
  if (isLoading) return <ListSkeleton rows={5} />
  if (err?.statusCode === 403 || err?.message?.includes('assigned patients')) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20 p-8 text-center">
        <p className="text-red-300">You can only view your assigned patients.</p>
        <Link
          to="/doctor/patients"
          className="mt-3 rounded bg-zinc-800 px-4 py-1.5 text-sm hover:bg-zinc-700"
        >
          Back to search
        </Link>
      </div>
    )
  }
  if (error) return <ErrorState error={error} />

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/doctor/patients"
        className="mb-4 flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to patients
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPrescribeForm(!showPrescribeForm)}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700"
          >
            <Pill className="h-4 w-4" />
            {showPrescribeForm ? 'Cancel' : 'Prescribe'}
          </button>
          <button
            onClick={() => setShowRecordForm(!showRecordForm)}
            className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            {showRecordForm ? 'Cancel' : 'Add Visit Note'}
          </button>
        </div>
      </div>

      {showRecordForm && (
        <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4" /> New Visit Note
          </h3>
          <form onSubmit={onSubmitRecord} className="space-y-3">
            <textarea
              {...recordForm.register('notes')}
              rows={4}
              placeholder="Enter clinical notes..."
              className="w-full rounded border border-zinc-700 bg-zinc-800 p-3 text-sm text-white outline-none focus:border-green-500"
            />
            {recordForm.formState.errors.notes && (
              <p className="text-xs text-red-400">{recordForm.formState.errors.notes.message}</p>
            )}
            <button
              type="submit"
              disabled={createRecordMutation.isPending}
              className="rounded bg-green-600 px-4 py-1.5 text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {createRecordMutation.isPending ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>
      )}

      {showPrescribeForm && (
        <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Pill className="h-4 w-4" /> New Prescription
          </h3>
          <form onSubmit={onSubmitPrescribe} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Drug</label>
              <input
                type="text"
                {...prescribeForm.register('drug')}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Dosage</label>
                <input
                  type="text"
                  {...prescribeForm.register('dosage')}
                  placeholder="e.g. 10mg"
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Frequency</label>
                <input
                  type="text"
                  {...prescribeForm.register('frequency')}
                  placeholder="e.g. Once daily"
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Duration</label>
                <input
                  type="text"
                  {...prescribeForm.register('duration')}
                  placeholder="e.g. 30 days"
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Related Diagnosis (optional)
              </label>
              <select
                {...prescribeForm.register('diagnosisId')}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="">None</option>
                {history?.medicalRecords
                  .flatMap((r) => r.diagnoses ?? [])
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.condition}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={createPrescriptionMutation.isPending}
              className="rounded bg-blue-600 px-4 py-1.5 text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {createPrescriptionMutation.isPending ? 'Prescribing...' : 'Prescribe'}
            </button>
          </form>
        </div>
      )}

      <section className="mb-8">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-300">
          <Calendar className="h-5 w-5" /> Appointments
        </h3>
        {(!history?.appointments || history.appointments.length === 0) ? (
          <EmptyState title="No appointments" />
        ) : (
          <div className="space-y-2">
            {history.appointments.map((apt) => (
              <div key={apt.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">
                    {new Date(apt.scheduledAt).toLocaleString()}
                  </p>
                  <AppointmentStatusBadge status={apt.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-300">
          <Stethoscope className="h-5 w-5" /> Medical Records
        </h3>
        {(!history?.medicalRecords || history.medicalRecords.length === 0) ? (
          <EmptyState title="No medical records" />
        ) : (
          <div className="space-y-3">
            {history.medicalRecords.map((record) => (
              <div key={record.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-zinc-500">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => {
                      setActiveRecordId(
                        activeRecordId === record.id ? null : record.id,
                      )
                      diagnosisForm.reset()
                    }}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                  >
                    <Plus className="h-3 w-3" />
                    Add Diagnosis
                  </button>
                </div>
                <p className="mt-1 text-white">{record.notes}</p>
                {record.diagnoses && record.diagnoses.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {record.diagnoses.map((d) => (
                      <span
                        key={d.id}
                        className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400"
                      >
                        {d.condition}
                      </span>
                    ))}
                  </div>
                )}

                {activeRecordId === record.id && (
                  <form
                    onSubmit={onSubmitDiagnosis}
                    className="mt-3 space-y-2 border-t border-zinc-800 pt-3"
                  >
                    <input
                      type="text"
                      {...diagnosisForm.register('condition')}
                      placeholder="Diagnosis condition"
                      className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-green-500"
                    />
                    {diagnosisForm.formState.errors.condition && (
                      <p className="text-xs text-red-400">
                        {diagnosisForm.formState.errors.condition.message}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={addDiagnosisMutation.isPending}
                        className="rounded bg-green-600 px-3 py-1 text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {addDiagnosisMutation.isPending ? 'Adding...' : 'Save Diagnosis'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveRecordId(null)}
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-300">
          <Pill className="h-5 w-5" /> Prescriptions
        </h3>
        {(!history?.prescriptions || history.prescriptions.length === 0) ? (
          <EmptyState title="No prescriptions" />
        ) : (
          <div className="space-y-2">
            {history.prescriptions.map((rx) => (
              <div key={rx.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {rx.drug} <span className="text-sm text-zinc-400">{rx.dosage}</span>
                    </p>
                    <p className="text-sm text-zinc-500">
                      {rx.frequency} for {rx.duration}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {rx.diagnosis && (
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                      {rx.diagnosis.condition}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
