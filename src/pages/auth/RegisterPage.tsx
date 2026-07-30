import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '@/hooks/auth/useRegister'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'
import AuthLayout from '@/layouts/AuthLayout'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const registerMutation = useRegister()

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  return (
    <AuthLayout>
      <h2 className="mb-6 text-2xl font-bold text-white">Patient Registration</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Gender</label>
          <select
            {...register('gender')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-red-400">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Date of Birth</label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-xs text-red-400">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-400">Phone (optional)</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <a href="/login" className="text-blue-400 hover:underline">
          Sign in
        </a>
      </p>
    </AuthLayout>
  )
}
