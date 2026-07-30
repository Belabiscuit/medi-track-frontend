import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse, ApiError } from '@/types/api.types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
})

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown>
    if (body?.success && body.data !== undefined) {
        response.data = body.meta
        ? { data: body.data, meta: body.meta }
        : body.data

    }
    return response
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    const apiError = error.response?.data as ApiError | undefined
    return Promise.reject(apiError ?? error)
  },
)

export default client
