import { useAnalytics } from '@/hooks/admin/useAnalytics'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/common/Skeleton'
import ErrorState from '@/components/common/ErrorState'
import { Users, Stethoscope, Calendar } from 'lucide-react'

const GENDER_COLORS = ['#3b82f6', '#ec4899', '#a855f7']

export default function AnalyticsPage() {
  const { demographics, diagnoses, appointments, isLoading, error } = useAnalytics()

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[400px] lg:col-span-2" />
      </div>
    )
  if (error) return <ErrorState error={error} />

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="mb-6 text-2xl font-bold">Analytics</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-300">
            <Users className="h-5 w-5 text-blue-400" /> Demographics
          </h3>
          {demographics.data && demographics.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographics.data}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }: { name?: string; value?: number }) => `${name ?? ''}: ${value ?? 0}`}
                >
                  {demographics.data.map((_, i) => (
                    <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-zinc-500">No demographics data available.</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-300">
            <Stethoscope className="h-5 w-5 text-green-400" /> Top Diagnoses
          </h3>
          {diagnoses.data && diagnoses.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diagnoses.data} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="condition"
                  stroke="#71717a"
                  tick={{ fontSize: 11 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-zinc-500">No diagnosis data available.</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-300">
          <Calendar className="h-5 w-5 text-purple-400" /> Monthly Appointments
        </h3>
        {appointments.data && appointments.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={appointments.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Total"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Completed"
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="Cancelled"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-zinc-500">No appointment analytics available.</p>
        )}
      </div>
    </div>
  )
}
