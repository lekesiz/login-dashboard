import { useCallback } from 'react'
import { ActivityType } from '@prisma/client'

interface LogActivityOptions {
  type: ActivityType
  action: string
  details?: Record<string, unknown>
}

export function useActivityLog() {
  const logActivity = useCallback(async (options: LogActivityOptions) => {
    try {
      // This would typically be handled server-side, but this is a placeholder
      // for client-side activity tracking if needed
      console.log('Activity logged:', options)
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }, [])

  return { logActivity }
}