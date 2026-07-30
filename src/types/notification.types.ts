export interface Notification {
  id: string
  type: string
  message: string
  scheduledAt?: string
  relatedId?: string
}
