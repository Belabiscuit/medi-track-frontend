import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Link } from 'react-router-dom'
import { usePatientSearch } from '@/hooks/doctors/usePatientSearch'
import SearchInput from '@/components/common/SearchInput'
import { ListSkeleton } from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import { User, Search } from 'lucide-react'

export default function PatientSearchPage() {
  const [name, setName] = useState('')
  const debouncedName = useDebounce(name, 300)
  const { data: results, isFetching } = usePatientSearch({
    name: debouncedName || undefined,
  })

  const hasQuery = !!name

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold">Patients</h2>

      <div className="mb-6">
        <SearchInput
          value={name}
          onChange={setName}
          placeholder="Search your patients by name..."
        />
        <p className="mt-1 text-xs text-zinc-600">
          Results are scoped to patients you have appointments with.
        </p>
      </div>

      {!hasQuery && (
        <EmptyState
          title="Search for a patient"
          description="Type a name above to find your patients."
        />
      )}

      {hasQuery && isFetching && <ListSkeleton rows={3} />}

      {hasQuery && !isFetching && results && results.length === 0 && (
        <EmptyState
          title="No patients found"
          description="No assigned patients match your search."
        />
      )}

      {hasQuery && results && results.length > 0 && (
        <div className="space-y-2">
          {results.map((patient) => (
            <Link
              key={patient.id}
              to={`/doctor/patients/${patient.id}`}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:bg-zinc-800"
            >
              <User className="h-5 w-5 text-zinc-500" />
              <div>
                <p className="font-medium text-white">{patient.name}</p>
                <p className="text-sm text-zinc-500">{patient.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
