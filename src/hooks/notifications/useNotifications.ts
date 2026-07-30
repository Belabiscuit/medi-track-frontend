import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/api/notifications.api'
import type { Notification } from '@/types/notification.types'

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getMyNotifications(),
    refetchInterval: 60000,
  })
}
