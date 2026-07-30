import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUser } from '@/hooks/admin/useUser'
import { useCreateUser } from '@/hooks/admin/useCreateUser'
import { useUpdateUser } from '@/hooks/admin/useUpdateUser'
import { ListSkeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import { handleApiError } from '@/utils/apiErrorHandler'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const ROLES = ['PATIENT', 'DOCTOR', 'RECEPTIONIST'] as const

function buildSchema(role: string, isCreate: boolean) {
  const shape: Record<string, z.ZodTypeAny> = {
    name: z.string().min(1, 'Name is required'),
    gender: z.string().min(1, 'Gender is required'),
  }
  if (isCreate) {
    shape.email = z.string().email('Invalid email')
    shape.password = z.string().min(6, 'Password must be at least 6 characters')
  }
  if (role === 'PATIENT') {
    shape.dateOfBirth = z.string().min(1, 'Date of birth is required')
    shape.phone = z.string().optional()
  }
  if (role === 'DOCTOR') {
    shape.specialty = z.string().min(1, 'Specialty is required')
  }
  return z.object(shape)
}

type FormData = Record<string, string>

export default function UserFormPage() {
  const nav = useNavigate()
  const { role: roleParam, id } = useParams<{ role?: string; id?: string }>()
  const isCreate = !id
  const [selectedRole, setSelectedRole] = useState(roleParam ?? 'PATIENT')

  const { data: existingUser, isLoading: loadingUser, error: userError } = useUser(
    isCreate ? undefined : roleParam,
    isCreate ? undefined : id,
  )

  const schema = buildSchema(selectedRole, isCreate)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isCreate
      ? { name: '', email: '', password: '', gender: 'male', specialty: '', dateOfBirth: '', phone: '' }
      : undefined,
  })

  useEffect(() => {
    if (existingUser && !isCreate) {
      form.reset({
        name: existingUser.name,
        email: existingUser.email ?? '',
        gender: existingUser.gender,
        specialty: existingUser.specialty ?? '',
        dateOfBirth: existingUser.dateOfBirth ?? '',
        phone: existingUser.phone ?? '',
      })
    }
  }, [existingUser, isCreate, form])

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()

  const onSubmit = form.handleSubmit((data) => {
    if (isCreate) {
      createMutation.mutate(
        {
          role: selectedRole,
          payload: {
            email: data.email ?? '',
            password: data.password ?? '',
            name: data.name ?? '',
            gender: data.gender ?? '',
            specialty: data.specialty || undefined,
            dateOfBirth: data.dateOfBirth || undefined,
            phone: data.phone || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('User created')
            nav('/admin/users')
          },
          onError: (err) => toast.error(handleApiError(err)),
        },
      )
    } else {
      const payload: Record<string, string | undefined> = {}
      if (data.name !== existingUser?.name) payload.name = data.name
      if (data.gender !== existingUser?.gender) payload.gender = data.gender
      if (data.specialty !== (existingUser?.specialty ?? '')) payload.specialty = data.specialty || undefined
      if (data.dateOfBirth !== (existingUser?.dateOfBirth ?? '')) payload.dateOfBirth = data.dateOfBirth || undefined
      if (data.phone !== (existingUser?.phone ?? '')) payload.phone = data.phone || undefined
      if (Object.keys(payload).length === 0) {
        toast.info('No changes made')
        return
      }
      updateMutation.mutate(
        { role: roleParam!, id: id!, payload },
        {
          onSuccess: () => {
            toast.success('User updated')
            nav('/admin/users')
          },
          onError: (err) => toast.error(handleApiError(err)),
        },
      )
    }
  })

  if (!isCreate && loadingUser) return <ListSkeleton rows={5} />
  if (!isCreate && userError) return <ErrorState error={userError} />

  return (
    <div className="mx-auto max-w-lg">
      <Link
        to="/admin/users"
        className="mb-4 flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <h2 className="mb-6 text-2xl font-bold">
        {isCreate ? 'Add New User' : 'Edit User'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        {isCreate && (
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value)
                form.reset()
              }}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            {...form.register('name')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">
            Email{isCreate ? '' : ' (cannot change)'}
          </label>
          <input
            type="email"
            {...form.register('email')}
            disabled={!isCreate}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500 disabled:text-zinc-500"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.email.message}</p>
          )}
        </div>

        {isCreate && (
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <input
              type="password"
              {...form.register('password')}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-red-400">{form.formState.errors.password.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Gender</label>
          <select
            {...form.register('gender')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {selectedRole === 'DOCTOR' && (
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Specialty</label>
            <input
              type="text"
              {...form.register('specialty')}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
            />
            {form.formState.errors.specialty && (
              <p className="mt-1 text-xs text-red-400">{form.formState.errors.specialty.message}</p>
            )}
          </div>
        )}

        {selectedRole === 'PATIENT' && (
          <>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Date of Birth</label>
              <input
                type="date"
                {...form.register('dateOfBirth')}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
              />
              {form.formState.errors.dateOfBirth && (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.dateOfBirth.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Phone</label>
              <input
                type="text"
                {...form.register('phone')}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-amber-500"
              />
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded bg-amber-600 px-6 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isCreate
                ? 'Create User'
                : 'Save Changes'}
          </button>
          <Link
            to="/admin/users"
            className="rounded bg-zinc-800 px-6 py-2 text-sm text-zinc-400 hover:bg-zinc-700 hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
