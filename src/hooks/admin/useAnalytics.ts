import { useQueries } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'
import type { DemographicsData, DiagnosesData, AppointmentsAnalyticsData } from '@/api/admin.api'

export function useAnalytics() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['admin', 'analytics', 'demographics'],
        queryFn: () => adminApi.getDemographics(),
      },
      {
        queryKey: ['admin', 'analytics', 'diagnoses'],
        queryFn: () => adminApi.getDiagnoses(),
      },
      {
        queryKey: ['admin', 'analytics', 'appointments'],
        queryFn: () => adminApi.getAppointmentsAnalytics(),
      },
    ],
  })

  return {
    demographics: results[0] as {
      data?: DemographicsData[]
      isLoading: boolean
      error: unknown
    },
    diagnoses: results[1] as {
      data?: DiagnosesData[]
      isLoading: boolean
      error: unknown
    },
    appointments: results[2] as {
      data?: AppointmentsAnalyticsData[]
      isLoading: boolean
      error: unknown
    },
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error,
  }
}
