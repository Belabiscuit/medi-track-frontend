import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDoctorProfile } from '@/hooks/doctors/useDoctorProfile'
import { useUpdateDoctorProfile } from '@/hooks/doctors/useUpdateDoctorProfile'
import { updateDoctorSchema, type UpdateDoctorFormData } from '@/schemas/doctor.schema'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'

export default function DoctorProfilePage() {
  const { data: profile, isLoading, error } = useDoctorProfile()
  const updateMutation = useUpdateDoctorProfile()

  const form = useForm<UpdateDoctorFormData>({
    resolver: zodResolver(updateDoctorSchema),
    values: profile
      ? {
          name: profile.name,
          gender: profile.gender,
          specialty: profile.specialty,
        }
      : undefined,
  })

  const onSubmit = form.handleSubmit((data) => {
    const payload: Record<string, string | undefined> = {}
    if (data.name !== profile?.name) payload.name = data.name
    if (data.gender !== profile?.gender) payload.gender = data.gender
    if (data.specialty !== profile?.specialty) payload.specialty = data.specialty
    if (Object.keys(payload).length === 0) return
    updateMutation.mutate(payload)
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error} />

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-2xl font-bold">My Profile</h2>

      <form onSubmit={onSubmit} className="space-y-4">
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
            {...form.register('name')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-green-500"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Gender</label>
          <select
            {...form.register('gender')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-green-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Specialty</label>
          <input
            type="text"
            {...form.register('specialty')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-green-500"
          />
          {form.formState.errors.specialty && (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.specialty.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || !form.formState.isDirty}
          className="rounded bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
