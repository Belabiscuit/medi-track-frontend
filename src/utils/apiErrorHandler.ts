const KNOWN_MESSAGES: Record<string, string> = {
  'Network Error': 'Unable to reach the server. Please check that the backend is running and try again.',
  'Invalid email or password': 'Invalid email or password. Please try again.',
  'Invalid admin credentials': 'Invalid admin credentials. Please try again.',
  'A user with this email already exists': 'An account with this email already exists.',
  'An admin with this email already exists': 'An admin with this email already exists.',
  'Time slot already booked': 'This time slot is already booked. Please choose another.',
  'New time slot already booked': 'The new time slot is already booked. Please choose another.',
  'Cannot cancel a completed or already cancelled appointment': 'Cannot cancel a completed or already cancelled appointment.',
  'Cannot reschedule a completed appointment': 'Cannot reschedule a completed appointment.',
  'Only booked appointments can be checked in': 'Only booked appointments can be checked in.',
  'Only checked-in appointments can be checked out': 'Only checked-in appointments can be checked out.',
  'You can only view your assigned patients': 'You can only view your assigned patients.',
  'You can only cancel your own appointments': 'You can only cancel your own appointments.',
  'You can only reschedule your own appointments': 'You can only reschedule your own appointments.',
  'You can only add diagnoses to your own records': 'You can only add diagnoses to your own records.',
  'You can only request refills for your own prescriptions': 'You can only request refills for your own prescriptions.',
  'A claim for this appointment already exists': 'A claim for this appointment already exists.',
  'Unique constraint violation': 'A record with this value already exists.',
  'Record not found': 'The requested record was not found.',
  'Foreign key constraint failed': 'Invalid reference provided.',
  'No token provided': 'Authentication required. Please log in.',
  'Failed to fetch': 'Unable to connect to the server. Please check your connection and try again.',
  'Request failed with status code 500': 'Server error. Please try again later.',
}

function extractMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'An unexpected error occurred. Please try again.'

  if ('message' in error && typeof (error as Record<string, unknown>).message === 'string') {
    return (error as { message: string }).message
  }

  return 'An unexpected error occurred. Please try again.'
}

export function handleApiError(error: unknown): string {
  const message = extractMessage(error)
  return KNOWN_MESSAGES[message] ?? message
}
