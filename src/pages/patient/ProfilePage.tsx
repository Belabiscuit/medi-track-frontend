import { usePatientProfile } from '@/hooks/patients/usePatientProfile'
import { useUpdatePatientProfile } from '@/hooks/patients/useUpdatePatientProfile'
import { handleApiError } from '@/utils/apiErrorHandler'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'

export default function ProfilePage() {
  const { data: profile, isLoading, error } = usePatientProfile()
  const updateMutation = useUpdatePatientProfile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value
    const payload: Record<string, string | undefined> = {}
    if (phone !== (profile?.phone ?? '')) payload.phone = phone
    if (Object.keys(payload).length === 0) return
    updateMutation.mutate(payload, {
      onSuccess: () => toast.success('Profile updated'),
      onError: (err) => toast.error(handleApiError(err)),
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error} />

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-2xl font-bold">My Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Email</label>
          <input
            type="email"
            value={profile?.email ?? ''}
            disabled
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            value={profile?.name ?? ''}
            disabled
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Gender</label>
          <input
            type="text"
            value={profile?.gender ?? ''}
            disabled
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Date of Birth</label>
          <input
            type="text"
            value={profile?.dateOfBirth?.split('T')[0] ?? ''}
            disabled
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Phone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={profile?.phone ?? ''}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
