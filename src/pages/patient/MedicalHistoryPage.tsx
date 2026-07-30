import { useMedicalHistory } from '@/hooks/medicalRecords/useMedicalHistory'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { FileText, Pill, Calendar, Stethoscope } from 'lucide-react'

export default function MedicalHistoryPage() {
  const { data, isLoading, error } = useMedicalHistory()

  if (isLoading) return <ListSkeleton rows={5} />
  if (error) return <ErrorState error={error} />
  if (!data) return null

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold">Medical History</h2>

      <section className="mb-8">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-300">
          <Calendar className="h-5 w-5" /> Appointments
        </h3>
        {data.appointments.length === 0 ? (
          <EmptyState title="No appointments" />
        ) : (
          <div className="space-y-2">
            {data.appointments.map((apt) => (
              <div key={apt.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Dr. {apt.doctor?.name}
                      <span className="ml-2 text-sm text-zinc-500">({apt.doctor?.specialty})</span>
                    </p>
                    <p className="text-sm text-zinc-400">
                      {new Date(apt.scheduledAt).toLocaleString()}
                    </p>
                  </div>
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
        {data.medicalRecords.length === 0 ? (
          <EmptyState title="No medical records" />
        ) : (
          <div className="space-y-2">
            {data.medicalRecords.map((record) => (
              <div key={record.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-sm text-zinc-500">
                  Dr. {record.doctor?.name} &middot; {new Date(record.createdAt).toLocaleDateString()}
                </p>
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
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-300">
          <Pill className="h-5 w-5" /> Prescriptions
        </h3>
        {data.prescriptions.length === 0 ? (
          <EmptyState title="No prescriptions" />
        ) : (
          <div className="space-y-2">
            {data.prescriptions.map((rx) => (
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
                      Dr. {rx.doctor?.name} &middot; {new Date(rx.createdAt).toLocaleDateString()}
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
