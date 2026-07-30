import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAdminLogin } from '@/hooks/auth/useAdminLogin'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import AuthLayout from '@/layouts/AuthLayout'

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const adminLoginMutation = useAdminLogin()

  const onSubmit = handleSubmit((data) => {
    adminLoginMutation.mutate(data)
  })

  return (
    <AuthLayout>
      <h2 className="mb-6 text-2xl font-bold text-white">Admin Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={adminLoginMutation.isPending}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {adminLoginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-500">
        <a href="/admin/signup" className="text-blue-400 hover:underline">
          Create admin account
        </a>
        <span className="mx-2">|</span>
        <a href="/login" className="text-blue-400 hover:underline">
          Patient login
        </a>
      </p>
    </AuthLayout>
  )
}
