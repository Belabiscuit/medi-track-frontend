import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/api/doctors.api'
import { patientsApi } from '@/api/patients.api'
import { useBookAppointment } from '@/hooks/receptionist/useBookAppointment'
import { useOverrideAppointment } from '@/hooks/receptionist/useOverrideAppointment'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import SearchInput from '@/components/common/SearchInput'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { toast } from 'sonner'
import { ArrowLeft, User, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { handleApiError } from '@/utils/apiErrorHandler'

export default function BookAppointmentPage() {
  const nav = useNavigate()
  const [patientQuery, setPatientQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null)
  const [doctorId, setDoctorId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [showOverride, setShowOverride] = useState(false)
  const pendingPayload = useRef<{ patientId: string; doctorId: string; scheduledAt: string } | null>(null)

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorsApi.list(),
  })

  const { data: patientResults, isFetching: searchingPatients } = useQuery({
    queryKey: ['patients', 'search', patientQuery],
    queryFn: () => patientsApi.getAll({ name: patientQuery, page: 1, limit: 10 }),
    enabled: patientQuery.length >= 2,
  })

  const bookMutation = useBookAppointment()
  const overrideMutation = useOverrideAppointment()

  const resetForm = () => {
    setPatientQuery('')
    setSelectedPatient(null)
    setDoctorId('')
    setScheduledAt('')
    setOverrideReason('')
  }

  const handleSubmit = () => {
    if (!selectedPatient || !doctorId || !scheduledAt) return
    const payload = {
      patientId: selectedPatient.id,
      doctorId,
      scheduledAt,
    }
    pendingPayload.current = payload

    bookMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Appointment booked successfully')
        resetForm()
        nav('/receptionist/appointments')
      },
      onError: (err) => {
        const apiErr = err as { statusCode?: number } | undefined
        if (apiErr?.statusCode === 409) {
          setShowOverride(true)
        } else {
          toast.error(handleApiError(err))
        }
      },
    })
  }

  const handleOverride = () => {
    if (!pendingPayload.current || !overrideReason.trim()) return
    overrideMutation.mutate(
      { ...pendingPayload.current, reason: overrideReason.trim() },
      {
        onSuccess: () => {
          toast.success('Appointment booked (overridden)')
          setShowOverride(false)
          resetForm()
          nav('/receptionist/appointments')
        },
        onError: (err) => {
          toast.error(handleApiError(err))
        },
      },
    )
  }

  const canSubmit = selectedPatient && doctorId && scheduledAt

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/receptionist/appointments"
        className="mb-4 flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to calendar
      </Link>

      <h2 className="mb-6 text-2xl font-bold">Book Appointment</h2>

      <div className="space-y-5 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Patient</label>
          {selectedPatient ? (
            <div className="flex items-center justify-between rounded border border-zinc-700 bg-zinc-800 px-3 py-2">
              <span className="flex items-center gap-2 text-white">
                <User className="h-4 w-4 text-zinc-500" />
                {selectedPatient.name}
              </span>
              <button
                onClick={() => { setSelectedPatient(null); setPatientQuery('') }}
                className="text-xs text-zinc-500 hover:text-white"
              >
                Change
              </button>
            </div>
          ) : (
            <div>
              <SearchInput
                value={patientQuery}
                onChange={setPatientQuery}
                placeholder="Search patients by name..."
              />
              {searchingPatients && <LoadingSpinner size="sm" />}
              {patientResults && patientResults.data.length > 0 && (
                <div className="mt-1 max-h-48 overflow-y-auto rounded border border-zinc-700 bg-zinc-800">
                  {patientResults.data.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        setSelectedPatient({ id: p.id, name: p.name })
                      }
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700"
                    >
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      {p.name} — {p.email}
                    </button>
                  ))}
                </div>
              )}
              {patientResults && patientResults.data.length === 0 && patientQuery.length >= 2 && (
                <p className="mt-1 text-xs text-zinc-500">No patients found.</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Doctor</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          >
            <option value="">Select a doctor...</option>
            {doctors?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Date &amp; Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || bookMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {bookMutation.isPending ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>

      <ConfirmDialog
        open={showOverride}
        title="Schedule Conflict"
        message="This time slot is already booked. Override and book this appointment anyway?"
        confirmLabel="Override"
        variant="danger"
        onConfirm={handleOverride}
        onCancel={() => setShowOverride(false)}
      />
    </div>
  )
}
