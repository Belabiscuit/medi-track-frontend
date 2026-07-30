import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { router } from './routes/router'
import { handleApiError } from './utils/apiErrorHandler'
import './index.css'

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  }),
  queryCache: new QueryCache({
    onError: (error) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  </StrictMode>,
)
