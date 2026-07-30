import client from './client'
import type { Notification } from '@/types/notification.types'

export interface TriggerResponse {
  remindersGenerated: number
}

export const notificationsApi = {
  getMyNotifications() {
    return client
      .get<Notification[]>('/api/notifications/me')
      .then((r) => r.data)
  },

  triggerReminders() {
    return client
      .post<TriggerResponse>('/api/notifications/trigger')
      .then((r) => r.data)
  },
}
