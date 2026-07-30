export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: PaginationMeta
}

export type PaginatedResponse<T> = ApiResponse<T[]> & { meta: PaginationMeta }

export interface ApiError {
  success: false
  statusCode: number
  message: string
}
